
var express = require('express');
var app = express();

https = require('https');
http = require('http');
var path = require('path');

// Variables riot games

urlRegion = "euw1.api.riotgames.com"

apiKey = "RGAPI-8e36b71e-e5e1-4d56-ae7a-00f0ac0e5300"

urlDdragon = "http://ddragon.leagueoflegends.com/cdn/6.24.1/img/"
urlProfileIcons = urlDdragon+"profileicon/"
urlChampions = urlDdragon+"champion/"


MongoClient = require('mongodb').MongoClient;
urlMongo = 'mongodb://172.18.0.3:27017';
dbNameMongo = 'test';

fs = require('fs')
mustache = require('mustache')

api = require('./api.js');
mongo = require('./mongo.js')
controller = require('./controller.js');
templateMustache = require('./template.js');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/summoner/update/:name', function(req, res) {
  controller.getUserByNameApi(req.params.name, function(retourJson){
    res.send(retourJson);
  })
});

app.get('/summoner/get/:name', function(req, res) {
  controller.getUserByName(req.params.name, function(retourJsonUser){
    controller.getActiveGame(retourJsonUser, function(retourJson){
      templateMustache.renderTemplate(retourJson, "summoner.html", function(contenuTemplate){
        res.send(contenuTemplate);
      });
    })
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

app.get('/test', function(req, res){
  controller.saveProfilesIcons(function(retourJsonIcons){
    controller.saveChampions(function(retourJsonChampions){
        res.send(retourJsonChampions);
    })
  })
})

app.get('/featured-games', function(req, res){
  api.getFeaturedGames(function(retourJson){
    res.send(retourJson);
  })
})

app.listen(8080);
