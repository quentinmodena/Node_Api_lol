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
}
