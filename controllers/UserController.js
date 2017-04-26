var mongoose = require('mongoose');
var User = mongoose.model("User");
var _ = require('underscore');

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

    return self;
}