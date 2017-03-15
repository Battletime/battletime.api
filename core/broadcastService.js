module.exports = function(io){

    var self = {
        io: io
    };

    self.signup = function(user){
        self.io.emit('signup', user);
    }

    return self;

}