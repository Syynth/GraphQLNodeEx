var GraphQLList = require("graphql").GraphQLList,
  GraphQLObjectType = require("graphql").GraphQLObjectType,
  GraphQLSchema = require("graphql").GraphQLSchema,
  GraphQLString = require("graphql").GraphQLString,
  DataLoader = require("dataloader"),
  express = require('express'),
  graphqlHTTP = require('express-graphql'),
  fetch = require('node-fetch');


const BASE_URL = 'http://localhost:8080';

function fetchCustomerByURL(relativeURL) {
  return fetchResponseByURL(relativeURL).then(json => json.data);
}

function fetchResponseByURL(relativeURL) {
  return fetch(`${BASE_URL}${relativeURL}`).then(res => res.json());
}

const customerLoader = new DataLoader(
  urls => Promise.all(urls.map(fetchCustomerByURL))
);

const CustomerType = new GraphQLObjectType({
  name: 'Customer',
  description: 'Somebody that you used to know',
  fields: () => ({
    email_sender_address: {
      type: new GraphQLList(GraphQLString),
      resolve: customer => customer.email_sender_addresses,
    }
  })
});

var querySchema = new GraphQLObjectType({
  name: 'RootQueryType',
  description: 'things',
  fields: () => ({
    customer: {
      type: CustomerType,
      args: {
        id: {type: GraphQLString}
      },
      resolve: (root, args) => customerLoader.load(`/customer/${args.id}/sender-addresses`)
    }
  })
});

var schema = new GraphQLSchema({
  query: querySchema,
});

express()
  .use('/graphql', graphqlHTTP({ schema: schema, pretty: true }))
  .listen(3000);

console.log('GraphQL server running on http://localhost:3000/graphql');