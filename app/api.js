module.exports = {
  baseApiRequest: function(request, callback){
    const urlGet = 'https://'+urlRegion+request+"?api_key="+apiKey;

    https.get(urlGet, (res) => {
      var output = '';
      console.log('statusCode:', res.statusCode);
      console.log('urlGet:', urlGet);

      res.on('data', (data) => {
        output += data;
      });

      res.on('end', function () {
          var obj = JSON.parse(output);
          callback(obj);
      });

      res.on('uncaughtException', function (err) {
        console.error(err);
      });

    }).on('error', (e) => {
      console.error("Error : "+e);
    });
  },

  getSummonerByName: function(summonerName, callback){
    const url = "/lol/summoner/v3/summoners/by-name/" + summonerName

    this.baseApiRequest(url, function(retourGet){
      callback(retourGet);
    });
  },

  getSummonerById: function(accountId){
    const url = "/lol/summoner/v3/summoners/by-account/" + accountId

    this.baseApiRequest(url, function(retourGet){
      console.log(retourGet);
    });
  },

  getRecentMatches: function(accountId, callback){
    const url = "/lol/match/v3/matchlists/by-account/"+accountId+"/recent"

    this.baseApiRequest(url, function(retourGet){
      callback(retourGet);
    });
  },

  getMatchTimelines: function(matchId, callback){
    const url = "/lol/match/v3/timelines/by-match/"+matchId

    this.baseApiRequest(url, function(retourGet){
      callback(retourGet);
    });
  },

  getLeagueBySummonerId: function(summonerId, callback){
    const url = "/lol/league/v3/positions/by-summoner/"+summonerId

    this.baseApiRequest(url, function(retourGet){
      callback(retourGet);
    });
  },

  //Active game
  getActiveGameBySummonerId: function(summonerId, callback){
    const url = "/lol/spectator/v3/active-games/by-summoner/"+summonerId

    this.baseApiRequest(url, function(retourGet){
      callback(retourGet);
    });
  },

  getFeaturedGames: function(callback){
    const url = "/lol/spectator/v3/featured-games"

    this.baseApiRequest(url, function(retourGet){
      callback(retourGet);
    });
  },

  getMatchById: function(id, callback){
    const url = "/lol/match/v3/matches/" + id

    this.baseApiRequest(url, function(retourGet){
      callback(retourGet);
    });
  },

  //------------------------------------------------
  //------------- Static datas
  //------------------------------------------------

  getAllProfileIcons: function(callback){
    const url = "/lol/static-data/v3/profile-icons"

    /*this.baseApiRequest(url, function(retourGet){
      callback(retourGet);
    });*/

    fs.readFile('/app/app/icons.json', 'utf8', function(err, json){
      callback(JSON.parse(json));
    })
  },

  getAllChampions: function(callback){
    const url = "/lol/static-data/v3/champions"

    /*this.baseApiRequest(url, function(retourGet){
      callback(retourGet);
    });*/

    fs.readFile('/app/app/champs.json', 'utf8', function(err, json){
      callback(JSON.parse(json));
    })
  }
}
