var express = require('express');
var app = express();

var customers = [
  {
    id: 1,
    name: 'Customer-1',
  },
  {
    id: 2,
    name: 'Customer-2'
  },
];

var senderAddresses = [
  [], // No customer with ID 0
  ['email1', 'email2'],
  ['email3', 'email4']
];

var person = {
  "data": {
    "email_sender_addresses": [
      "email1",
      "email2"
    ]
  }
};

app.get(`/customer/:ID`, (req, res) => {
  res.send(JSON.stringify(customers.find(c => c.id === req.params.ID)));
});

var i = 0;
app.get('/customer/:ID/sender-addresses', function (req, res) {
//   var tmp = {};
//   tmp = person;
//   i++;
//   console.log("hit: " + i);
//   console.log(JSON.stringify(tmp));
//   res.send(JSON.stringify(tmp));
  res.send(JSON.stringify(senderAddresses[req.params.ID]));
});

app.listen(8080, function () {
  console.log('Example app listening on port 8080!');
});
