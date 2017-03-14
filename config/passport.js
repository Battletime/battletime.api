var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuthStrategy;
var configAuth = require('./auth');

// Use the GoogleStrategy within Passport.
//   Strategies in passport require a `verify` function, which accept
//   credentials (in this case, a token, tokenSecret, and Google profile), and
//   invoke a callback with a user object.
module.exports = function(passport){

    var googleOptions = configAuth.google;
    googleOptions.callbackURL = "http://localhost:3000/auth/google/callback";

    passport.use(new GoogleStrategy(googleOptions, function(token, tokenSecret, profile, done) {
        
    }));

}