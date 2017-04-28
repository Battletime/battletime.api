var mongoose = require('mongoose');
var Event = mongoose.model("Event");
var Battle = mongoose.model("Battle");
var qrCode = require('qrcode-npm')
var Guid = require('guid');
var Promise = require('promise');
var _ = require('underscore');

module.exports = function(){

    var self = {};

    //CREATE
    self.create = function(event){
        var newEvent = Event(event);
        newEvent.secret = Guid.raw();
        return newEvent.save();
    }

    //READ
    self.get = function(){
        return Event.find();
    }

    self.getMyEvents = function(userId){
        
        return Event.find({ participants: userId })
            .populate('participants');
    }


    //READ ONE
    self.getDetails = function(id){
        return new Promise(function (resolve, reject) {
            Event.findById(id)
                .populate('participants')
                .exec( (err, event) => {   
                if(err)
                    return reject(err);


                self.getBattles(event._id).then( (battles) => {
                    event = event.toJSON();
                    event.qrImage = generateQr(event.secret);
                    event.secret = null;
                    event.battles = battles;
                    resolve(event);
                });
                
            });
        });
    }

    //UPDATE
    self.update = function(id, event){
        //todo: implement
    }

    //DELETE
    self.delete = function(id){
        //todo: implement
    }

    //OTHER
    self.action = function(id, action){
         return new Promise(function (resolve, reject) {
            Event.findById(id).exec( (err, event) => {   
                if(err)
                    return reject(err);

                switch(action){
                    case "start":  event.startedOn = new Date();;break;
                    case "stop":  event.stoppedOn = new Date();;break;
                    case "reset":  event.reset();break;
                    default: break;
                }

                event.save((err, event) =>  resolve(event));
               
            });
        });
    }

    self.getBattles = function(eventId){
        return Battle.find({ "event": eventId}).populate('participants');
    }

    self.generateBattles = function(eventId){
         return new Promise(function (resolve, reject) {
            Event.findById(eventId)
                .exec( (err, event) => {  
                    if(err) return reject(err);

                    //remove all previous battles for this event
                    Battle.remove({ "event": event._id}).then( (err) => {

                       
                        var randomParticipants = _.shuffle(event.participants);
                        var battles = [];

                        for(var i = 0; i < randomParticipants.length;){

                            var participants = [randomParticipants[i], randomParticipants[i+ 1]];
                            
                            //if 3 left, make a 3 way battle
                            if(randomParticipants.length - i == 3){
                                participants.push(randomParticipants[i + 2]);
                                i = randomParticipants.length;
                            }

                            battles.push(Battle({
                                participants: participants,
                                event: event._id,
                            }));

                             i = i + 2;
                        }

                        //save as bulk
                        Battle.collection.insert(battles, (err, reponse) => {
                            self.getBattles(event._id).then( (battles) => {
                                resolve(battles)
                            });
                        });

                    })

                });
         });
    }
   
    self.signUp = function(eventId, participants){
         return new Promise(function (resolve, reject) {
            Event.findById(eventId)
                .exec( (err, event) => {  
                    if(err) return reject(err);

                    participants.forEach(function(user) {
                        if(!_.contains(event.participants, "" + user._id)){
                            event.participants.push(user._id);
                        }
                    }, this);

                    event.save( (err, event) => {
                        resolve(event) 
                    });
                });
         });      
    }

    self.signupWithSecret = function(eventSecret, userId){
        
         return new Promise(function (resolve, reject) {
            Event.findOne({ 'secret': eventSecret})
                .exec( (err, event) => {  
                     
                    if(err) return reject(err);

    
                    if(!_.contains(event.participants, "" + userId)){
                        event.participants.push(userId);
                        event.save( (err, event) => {
                            console.log(err);
                            resolve(event) 
                        });
                    }        
                    else{
                        return reject();
                    }        
                });
         });      

    }

    function generateQr(secret){
        var qr = qrCode.qrcode(4, 'M');
        qr.addData(secret);
        qr.make();
        return qr.createImgTag(4);    // creates an <img> tag as text
    }

    

    return self;

}