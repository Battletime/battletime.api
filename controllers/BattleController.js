var mongoose = require('mongoose');
var Battle = mongoose.model("Battle");
var User = mongoose.model("User");
var _ = require('underscore');

module.exports = function(){

    var self = {};

    //CREATE
    self.create = function(battle){
        var newBattle = Battle(battle);
        return newBattle.save();
    }

    //READ
    self.get = function(){
        return Battle.find()
            .populate('participants event');
    }

    self.getMyBattles = function(userId){
        return Battle.find({ participants: userId })
            .populate('participants event');
    }

    //READ
    self.getDetails = function(id){
        return Battle.findById(id)
            .populate('participants event');
    }

    //OTHER
    self.action = function(id, action){
         return new Promise(function (resolve, reject) {
            Battle.findById(id).exec( (err, battle) => {   
                if(err)
                    return reject(err);

                switch(action){
                    case "start":  battle.startedOn = new Date();;break;
                    case "stop":  battle.stoppedOn = new Date();;break;
                    case "reset":  battle.reset();break;
                    default: break;
                }

                battle.save((err, battle) =>  resolve(battle)); 
            });
        });
    }

    self.createRandom = function(userId){
          return new Promise(function (resolve, reject) {          
              User.random(userId, (err, user) => {

                var battle = new Battle({
                    participants: [userId, user._id],
                    startedOn: new Date()
                })

                battle.save((err, battle) => {
                    resolve(battle);
                })               
              });
          });
    }

    return self;
}