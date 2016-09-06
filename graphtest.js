var GraphQLList = require("graphql").GraphQLList,
  GraphQLObjectType = require("graphql").GraphQLObjectType,
  GraphQLSchema = require("graphql").GraphQLSchema,
  GraphQLString = require("graphql").GraphQLString,
  GlobalId = require("graphql-relay").GlobalId,
  globalIdField = require("graphql-relay").globalIdField,
  nodeDefinitions = require("graphql-relay").nodeDefinitions,
  DataLoader = require("dataloader"),
  express = require('express'),
  graphqlHTTP = require('express-graphql'),
  fetch = require('node-fetch');


  const BASE_URL = 'http://localhost:3001';

  function fetchResponseByURL(relativeURL) {
    return fetch(`${BASE_URL}${relativeURL}`).then(res => res.json());
  }

  function fetchPeople() {
    return fetchResponseByURL('/people/').then(json => json.people);
  }

  function fetchPersonByURL(relativeURL) {
    return fetchResponseByURL(relativeURL).then(json => json);
  }

  const personLoader = new DataLoader(
    urls => Promise.all(urls.map(fetchPersonByURL))
  );

  const { nodeInterface, nodeField } = nodeDefinitions(
    globalId => {
      const {type, id} = fromGlobalId(globalId);
      if (type === 'Person') {
        return personLoader.load(`/people/${id}/`);
      }
    },
    object => {
      if (object.hasOwnProperty('username')) {
        return 'Person';
      }
    }
  );

  const PersonType = new GraphQLObjectType({
    name: 'Person',
    description: 'Somebody that you used to know',
    fields: () => ({
      firstName: {
        type: GraphQLString,
        resolve: person => person.first_name,
      },
      lastName: {
        type: GraphQLString,
        resolve: person => person.last_name,
      },
      email: {type: GraphQLString},
      id: globalIdField('Person'),
      username: {type: GraphQLString},
      friends: {
        type: new GraphQLList(PersonType),
        resolve: person => personLoader.loadMany(person.friends),
      }
  }),
    interfaces: [nodeInterface]
  });

  const QueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'The root of all... queries',
    fields: () => ({
      allPeople: {
        type: new GraphQLList(PersonType),
        resolve: fetchPeople,
      },
      node: nodeField,
      person: {
        type: PersonType,
        args: {
          id: { type: GraphQLString },
        },
        resolve: (root, args) => personLoader.load(`/people/${args.id}/`),
      }
    })
  });

var schema = new GraphQLSchema({
  query: QueryType,
});

express()
  .use('/graphql', graphqlHTTP({ schema: schema, pretty: true }))
  .listen(3000);

console.log('GraphQL server running on http://localhost:3000/graphql');
