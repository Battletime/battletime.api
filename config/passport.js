var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var configAuth = require('./auth');
var User = require('mongoose').model('User');

// Use the GoogleStrategy within Passport.
//   Strategies in passport require a `verify` function, which accept
//   credentials (in this case, a token, tokenSecret, and Google profile), and
//   invoke a callback with a user object.
module.exports = function(passport){
    
    passport.use(
        new GoogleStrategy({
            clientID: configAuth.google.clientID,
            clientSecret: configAuth.google.clientSecret,
            callbackURL:  "http://localhost:3000/api/auth/google/callback"
        }, 
        function(token, tokenSecret, profile, done) {
            process.nextTick(function() {
                User.findOne({_id: profile.emails[0].value})
                    .exec(function(err, user){
                        if(user) return done(user);

                        //create new user
                        var user = new User({
                            _id: profile.emails[0].value,
                            name: profile.displayName,
                            googleImageUri: profile.photos[0].valuex,
                            role: "user"
                        }).save(function(err, user){
                            done(user);
                        });                              
                    })
              
            });
        })
    );

}