module.exports = function(io){

    var self = {};

    self.signup = function(user){
        io.emit('signup', user);
    }

    self.signout = function(user){
        io.emit('signout', user);
    }

    self.eventAction = function(event){
        io.emit('event.action', event);
         console.log('event emitted!');
    }

    self.battleAction = function(battle){
        io.emit('battle.action', battle);
    }   

    return self;

}