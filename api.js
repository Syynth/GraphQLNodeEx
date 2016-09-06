var express = require('express');
var app = express();

var person = {
    "people":[
        {
            "friends":[
                "/people/2/",
                "/people/3/"
            ],
            "username":"steve1",
            "email": "steve1@steve.com",
            "last_name": "n1",
            "id": "1",
            "first_name":"steven1"
        },
        {
            "friends":[
                "/people/1/",
                "/people/3/"
            ],
            "username":"steven2",
            "email": "steve2@steve.com",
            "last_name": "thomas2",
            "id": "2",
            "first_name":"steven2"
        },
        {
            "friends":[
                "/people/1/",
                "/people/2/"
            ],
            "username":"steven3",
            "email": "steve3@steve.com",
            "last_name": "thomas3",
            "id": "3",
            "first_name":"steven3"
        }
    ]
};

app.get('/people/:testID/', function (req, res) {
    var tmp = {};
    tmp = person.people[req.params.testID - 1];
    //console.log(JSON.stringify(tmp));
    res.send(JSON.stringify(tmp));
});

app.get('/people/', function (req, res) {
    //console.log(JSON.stringify(person));
    res.send(JSON.stringify(person));
});

app.listen(3001, function () {
  console.log('Example app listening on port 3001!');
});
