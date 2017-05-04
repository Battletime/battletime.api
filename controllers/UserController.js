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
        return new Promise(function (resolve, reject) {
            User.findById(userId).exec( (err, user) => {   
                if(err || !rawImage)
                    return reject(err);
                
                                 
                var base64Data = rawImage.replace(/^data:image\/jpeg;base64,/, "");
                var location = "/images/" + user._id + ".jpg";
                require("fs").writeFile("public" + location, base64Data, 'base64', function(err) {
                    if(err)
                        return reject(err);
                    
                    user.imageUri = location;
                    user.save((err, user) =>  resolve(user)); 
                });   
            });     
        });
    }

    return self;
}