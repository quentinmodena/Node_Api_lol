module.exports = {
  getUserByNameMongo : function(name, callback){
    mongo.findUserByName(name, function(err, retourJson){
      console.log(err);

      callback(retourJson);
    });
  },

  getUserByNameApi : function(name, callback){
    api.getSummonerByName(name, function(retourJson){
      console.log(retourJson);

      callback(retourJson);
    });
  },

  formatUserObject: function(user)
  {
    if(typeof(user.id) !== "undefined" && typeof(user._id) === "undefined"){
      user._id = user.id;
    }

    return user;
  },

  saveUser: function(user, callback)
  {
    mongo.saveUser(user ,function(err, result){
        callback(err, result);
    });
  },

  getRecentMatchesApi: function(idAccount, callback)
  {
    api.getRecentMatches(idAccount, function(retourJson){

      mongo.findUserByIdAccount(idAccount, function(err, result){
        let user = result;

        user.recentMatches = retourJson;

        mongo.saveUser(user ,function(err, result){
            callback(err, result);
        });
      });

      //callback(retourJson);
    });
  }


}
