module.exports = function(io){

    var self = {};

    self.signup = function(user){
        io.emit('signup', user);
    }

    self.signout = function(user){
        io.emit('signout', user);
    }

    return self;

}