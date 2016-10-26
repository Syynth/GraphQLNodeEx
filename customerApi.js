var express = require('express');
var app = express();

var person = {
  "data": {
    "email_sender_address": [
      "email1",
      "email2"
    ]
  }
};
var i = 0;
app.get('/customer/:ID/sender-addresses', function (req, res) {
  var tmp = {};
  tmp = person;
  i++;
  console.log("hit: " + i);
  console.log(JSON.stringify(tmp));
  res.send(JSON.stringify(tmp));
});

app.listen(8080, function () {
  console.log('Example app listening on port 8080!');
});
