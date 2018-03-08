module.exports = {
  user: {
    id: "",
    accountId: "",
    name: "",
    revisionDate: "",
    recentMatches: []
  },

  request: function(callback) {
    MongoClient.connect(urlMongo, function(err, client) {
      if(err != null)
        console.error(err);
      else
        callback(err, client);
    });
  },

  findUserByName: function(name, callback)
  {
    this.request(function(err, client){
      const col = client.db(dbNameMongo).collection('users');

      col.findOne({name : name}, function(err, result){
        callback(err, result);

        client.close();
      });
    });
  },

  findUserByIdAccount: function(idAccount, callback)
  {
    this.request(function(err, client){
      const col = client.db(dbNameMongo).collection('users');

      col.findOne({accountId : parseInt(idAccount)}, function(err, result){
        callback(err, result);

        client.close();
      });
    });
  },

  saveUser: function(data, callback)
  {
    this.request(function(err, client){
      const col = client.db(dbNameMongo).collection('users');

      col.save(data, {w:1}, function(err, result) {
        callback(err, result);

        client.close();
      });
    });
  },

  getMatches: function(condition, callback){
    this.request(function(err, client){
      const col = client.db(dbNameMongo).collection('matches');

      col.find({ $or : condition }).toArray(function(err, result) {
        callback(err, result);

        client.close();
      });
    });
  },

  getMatchById: function(idMatch, callback){
    this.request(function(err, client){
      const col = client.db(dbNameMongo).collection('matches');

      col.findOne({_id : idMatch}, function(err, result){
        callback(err, result);

        client.close();
      });
    });
  },

  saveMatch: function(data, callback){
    this.request(function(err, client){
      const col = client.db(dbNameMongo).collection('matches');

      col.save(data, {w:1}, function(err, result) {
        callback(err, result);

        client.close();
      });
    });
  },

  getAllSummoners: function(callback)
  {
    this.request(function(err, client){
      const col = client.db(dbNameMongo).collection('users');

      col.find({}).toArray(function(err, result) {
        callback(err, result);

        client.close();
      });
    });
  },

  clearAll: function()
  {
    this.request(function(err, client){
      const col = client.db(dbNameMongo).collection('users');

      col.remove({},function(err,numberRemoved){
          console.log("inside remove call back" + numberRemoved);
      });
    });
  },


  /*
    Gestion des icones du profil
  */
  saveIcons: function(data, callback)
  {
    this.request(function(err, client){
      const col = client.db(dbNameMongo).collection('icons');

      col.remove({},function(err,numberRemoved){
          console.log("Remove all icons successful");

          col.insertMany(data, function(err, result) {
            callback(err, result);

            client.close();
          });
      });
    });
  },

  findIconById: function(id, callback)
  {
    this.request(function(err, client){
      const col = client.db(dbNameMongo).collection('icons');

      //col.find({}).toArray( function(err, result){
      col.findOne({_id : id}, function(err, result){
        callback(err, result);

        client.close();
      });
    });
  },

  /*
    Gestion des champions
  */
  saveChampions: function(data, callback)
  {
    this.request(function(err, client){
      const col = client.db(dbNameMongo).collection('champions');

      col.remove({},function(err,numberRemoved){
          console.log("Remove all icons successful");

          col.insertMany(data, function(err, result) {
            callback(err, result);

            client.close();
          });
      });
    });
  },

  findChampionById: function(id, callback)
  {
    this.request(function(err, client){
      const col = client.db(dbNameMongo).collection('champions');

      //col.find({}).toArray( function(err, result){
      col.findOne({_id : id}, function(err, result){
        callback(err, result);

        client.close();
      });
    });
  },

  findAllChampions: function(callback)
  {
    this.request(function(err, client){
      const col = client.db(dbNameMongo).collection('champions');

      col.find({}).toArray( function(err, result){
        callback(err, result);

        client.close();
      });
    });
  },
}
