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

    self.uploadAvatar = function(userId, req, res){
        User.findById(userId).exec( (err, user) => {   

            //setup multer
            var storage = multer.diskStorage({
                destination: function (req, file, callBack) {
                    callBack(null, '/images');
                },
                filename: function (req, file, callBack) {
                    callBack(null, user.id + ".png");
                }
            });

            var upload = multer({ storage: storage }).single('file');
            upload(req, res, function(err) {
                if(err) {
                    return res.end("Error uploading file.");
                }
                res.end("File is uploaded");
            });
        });
        
    }

    return self;
}