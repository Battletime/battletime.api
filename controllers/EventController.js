var mongoose = require('mongoose');
var Event = mongoose.model("Event");
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

    //READ ONE
    self.getDetails = function(id){
        return new Promise(function (resolve, reject) {
            Event.findById(id)
                .populate('participants')
                .exec( (err, event) => {   
                if(err)
                    return reject(err);

                event.qrImage = generateQr(event.secret);
                //event.secret = undefined;
                resolve(event);
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
   
    self.signUp = function(eventId, userId){
         return new Promise(function (resolve, reject) {
            Event.findById(eventId)
                .exec( (err, event) => {  
                    if(err) return reject(err);

                    if(!_.contains(event.participants, "" + userId)){
                        event.participants.push(userId);
                        event.save( (err, event) => {
                            resolve(event) 
                        });

                    }
                    else{
                        resolve(event);
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