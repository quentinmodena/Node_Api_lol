
var express = require('express');
var app = express();

https = require('https');

urlRegion = "euw1.api.riotgames.com"

apiKey = "RGAPI-7d881965-7ad2-42b0-9f99-48c4f7f841f3"

MongoClient = require('mongodb').MongoClient;
urlMongo = 'mongodb://172.18.0.3:27017';
dbNameMongo = 'test';

api = require('./api.js');
mongo = require('./mongo.js')
const controller = require('./controller.js');

app.get('/summoner/update/:name', function(req, res) {
  controller.getUserByNameApi(req.params.name, function(retourJson){
    res.send(retourJson);

    userObject = controller.formatUserObject(retourJson);

    controller.saveUser(userObject, function(err, result){

    });
  })
});

app.get('/summoner/get/:name', function(req, res) {
  controller.getUserByNameMongo(req.params.name, function(retourJson){
      res.send(retourJson);
  })
});

app.get('/getRecentMatches/:id', function(req, res){
  controller.getRecentMatchesApi(req.params.id, function(retourJson){
      res.send(retourJson);
  })
})

app.get('/getMatchTimelines/:id', function(req, res){
  api.getMatchTimelines(req.params.id, function(retourJson){
      res.send(retourJson);
  })
})

app.get('/clearAll', function(req, res){
  mongo.clearAll();
})

app.get('/getAllSummoners', function(req, res) {
  mongo.getAllSummoners(function(err, retourJson){
      res.send(retourJson);
  })
});

app.listen(8080);
