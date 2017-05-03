var mongoose = require('mongoose');
var User = mongoose.model("User");
var _ = require('underscore');
var multer  =   require('multer');


module.exports = function(){

    var self = {};

    //CREATE
    self.create = function(user){
        var newUser = User(user);
        newUser.role = "user";
        return newUser.save();
    }

    //READ
    self.get = function(){
        return User.find();
    }

    self.uploadAvatar = function(userId, rawImage){
        console.log("starting upload of avatar 2!");
        return new Promise(function (resolve, reject) {
            User.findById(userId).exec( (err, user) => {   

                if(err){
                     console.log("User not found with id " + userId);
                    reject(err);
                }
                    
                
                console.log("User found with id " + user._id);

                var base64Data = rawImage.replace(/^data:image\/png;base64,/, "");
                var location = "/images/" + user._id + ".jpg";
                require("fs").writeFile(location, base64Data, 'base64', function(err) {
                    console.log("Write file complete");

                    if(err){
                        console.log("err wile writing file");
                        console.log(err);
                        return reject(err);
                    }
                        
                    console.log("Sving user with new image location" + location);
                    user.imageUri = location;
                    user.save((err, user) =>  resolve(user)); 
                });   
            });     
        });
    }

    return self;
}