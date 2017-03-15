var mongoose = require('mongoose');
var Event = mongoose.model("Event");
var qrCode = require('qrcode-npm')
var Guid = require('guid');
var Promise = require('promise');
var _ = require('underscore');

module.exports = function(){

    var self = {};

    self.get = function(){
        return Event.find();
    }

    self.getDetails = function(id){
        return new Promise(function (resolve, reject) {
            Event.findById(id).exec( (err, event) => {   
                if(err)
                    return reject(err);

                event.qrImage = generateQr(event.secret);
                //event.secret = undefined;
                resolve(event);
            });
        });
    }

    self.update = function(id, event){
        //todo: implement
    }

    self.create = function(event){
        var newEvent = Event(event);
        newEvent.secret = Guid.raw();
        return newEvent.save();
    }

    self.delete = function(id){
        //todo: implement
    }

    self.signUp = function(secret, userId){
         return new Promise(function (resolve, reject) {
            Event.findOne({secret: secret}).exec( (err, event) => {  
                if(err) return reject(err);

                if(!_.contains(event.participants, "" + userId)){
                    event.participants.push(userId);
                    event.save( (err, event) => resolve(event));
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