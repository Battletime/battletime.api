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
            .populate('participants event winner');
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

    self.setWinner = function(id, userId){
        return new Promise(function (resolve, reject) {
            Battle.findById(id).exec( (err, battle) => {   
                if(err)
                    return reject(err);

                if(battle.winner == userId){
                    userId = null;
                }
          
                battle.winner = userId;
                battle.save((err, battle) =>  resolve(battle)); 
            });
        });
    }

    self.vote = function(id, vote){
        return new Promise(function (resolve, reject) {
            Battle.findById(id).exec( (err, battle) => {   
                if(err)
                    return reject(err);

                if(battle.containsVoteOf(vote.byUserId))
                    return reject({ status: 400 });

                vote.timestamp = new Date();
                battle.votes.push(vote);

                //als er 2 votes zijn, zijn we klaar
                if(battle.votes.length >= 2){
                    battle.decideWinner();
                    battle.stoppedOn = new Date();
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