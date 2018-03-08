module.exports = {
  formatUserObject: function(user)
  {
    if(typeof(user.id) !== "undefined" && typeof(user._id) === "undefined"){
      user._id = user.id;
    }

    return user;
  },

  getUserByNameMongo : function(name, callback){
    mongo.findUserByName(name, function(err, retourJson){
      if(retourJson == null)
      {
        controller.getUserByNameApi(name, function(retourJsonApi){
          callback(retourJsonApi);
        });
      }
      else
        callback(retourJson);
    });
  },

  getUserByName : function(name, callback){
    controller.getUserByNameMongo(name, function(retourJson){
      mongo.findIconById(retourJson.profileIconId, function(err, result){
        retourJson.icon = result;
        callback(retourJson);
      })
    })
  },

  getUserByNameApi : function(name, callback){
    api.getSummonerByName(name, function(retourJson){
      userObject = controller.formatUserObject(retourJson);
      mongo.findIconById(retourJson.profileIconId, function(err, resultIcon){
        userObject.icon = resultIcon;

        api.getLeagueBySummonerId(userObject.id, function(retourJsonLeague){
          userObject.leagues = retourJsonLeague

          api.getRecentMatches(userObject.accountId, function(retourJsonRecent){
            userObject.recentMatches = retourJsonRecent

            mongo.findAllChampions(function(err, champions){

              for(let idMatch in userObject.recentMatches.matches)
              {
                for(let champion of champions)
                {
                  if(champion._id == userObject.recentMatches.matches[idMatch].champion)
                    userObject.recentMatches.matches[idMatch].champion = champion;
                }
              }

              callback(userObject);

              controller.saveUser(userObject, function(err, result){ });
            })
          });
        });
      })
    });
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

        user.recentMatches = controller.getDetailListOfMatches(retourJson)

        mongo.findAllChampions(function(err, champions){

          for(let idMatch in user.recentMatches)
          {
            user.recentMatches[idMatch].champion = champions[user.recentMatches[idMatch].champion];
          }

          mongo.saveUser(user ,function(err, result){
              callback(err, result);
          });
        })


      });

      //callback(retourJson);
    });
  },

  getActiveGame: function(user, callback)
  {
    api.getActiveGameBySummonerId(user.id, function(retourJson){
      if(retourJson.gameId != undefined)
      {
        user.currentGame = retourJson;
      }

      callback(user);
    })
  },

  getMatchDetail: function(idMatch, callback){
    mongo.getMatchById(idMatch, function(err, retourJsonMatch){
      if(retourJsonMatch == null){
        api.getMatchById(idMatch, function(retourJsonMatchApi){
          retourJsonMatchApi._id = retourJsonMatchApi.gameId

          retourJsonMatchApi = controller.formatMatchObject(retourJsonMatchApi)

          callback(retourJsonMatchApi);

          mongo.saveMatch(retourJsonMatchApi, function(err, result){

          });
        });
      }
      else {
        retourJsonMatch = controller.formatMatchObject(retourJsonMatch)

        callback(retourJsonMatch);
      }
    })
  },

  getDetailListOfMatches: function(listMatches){
    //appel mongo qui recup les details de la liste des matches
    //Si chaque match n'a pas un detail
      //Appel à l'api pour chaque match que l'on a pas dans la db
      //sauvegarde de chaque match recup
      //Ajout dans la liste des details recupéré depuis mongo
    //parcourt la liste des matchs et on affecte le detail à chaque match
    //retourne la liste des matches

    console.log(listMatches)
    let idList = []


    for(let match of listMatches.matches){
      idList.push({gameId: match.gameId})
    }

    

    console.log(idList)

    return listMatches
  },

  formatMatchObject: function(matchObject){
    return matchObject
  },


  saveProfilesIcons: function(callbackFunction)
  {
    api.getAllProfileIcons(function(retourJson){
      let dataToSave = [], arrayTmp;

      for(let icon in retourJson.data){
        arrayTmp = {
          "_id": retourJson.data[icon].id,
          "image": retourJson.data[icon].image.full,
        }

        controller.recupererFichier(urlProfileIcons, "icons/", retourJson.data[icon].image.full)

        dataToSave.push(arrayTmp)
      }

      mongo.saveIcons(dataToSave, function(err, result){
        console.error(err);
      })

      callbackFunction(dataToSave);
    });
  },

  saveChampions: function(callbackFunction)
  {
    api.getAllChampions(function(retourJson){
      console.log(retourJson)

      let dataToSave = [], arrayTmp;

      for(let icon in retourJson.data){
        arrayTmp = {
          "_id": retourJson.data[icon].id,
          "name": retourJson.data[icon].name,
          "image": retourJson.data[icon].key+".png"
        }

        controller.recupererFichier(urlChampions, "champions/", retourJson.data[icon].key+".png")

        dataToSave.push(arrayTmp)
      }

      mongo.saveChampions(dataToSave, function(err, result){
        console.error(err);
        //console.log(result);
      })

      callbackFunction(retourJson);
    });
  },

  recupererFichier: function(url, prefixe, image){
    let file = fs.createWriteStream("/app/app/public/imagesApi/"+prefixe+image);

    let request = http.get(url+image, function(response) {
      response.pipe(file);
    });

    request.on('error', function(err){
      console.error("Erreur lors de la récupération d'un fichier");
    })
  }


}
