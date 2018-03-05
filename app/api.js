module.exports = {
  baseApiRequest: function(request, callback){
    const urlGet = 'https://'+urlRegion+request+"?api_key="+apiKey;

    https.get(urlGet, (res) => {
      var output = '';
      console.log('statusCode:', res.statusCode);
      console.log('urlGet:', urlGet);

      res.on('data', (data) => {
        console.log('data');
        output += data;
      });

      res.on('end', function () {
          var obj = JSON.parse(output);
          callback(obj);
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
  }
}
