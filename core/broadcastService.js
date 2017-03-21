module.exports = function(io){

    var self = {};

    self.signup = function(user){
        io.emit('signup', user);
    }

    return self;

}