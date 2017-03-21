var router = require('express').Router();
var passport = require('passport');
var jwt = require('jsonwebtoken');

router.get('/google', passport.authenticate('google', { 
    session:false,
    scope : ['profile', 'email'] 
}));


router.get( '/google/callback', function(req, res, next){
        passport.authenticate('google', {
            failureRedirect: '/', 
            session: false
        }, function(user, done) {

            //generate token
            var payload = {
                email: user._id
            }

            var token = jwt.sign(payload, 'pointypony');
            res.redirect("/api/auth/tokenProvider/" + token);

        })(req, res, next);
});


router.get( '/tokenProvider/:token', function(req, res, next){
    res.send(req.params.token);
});

module.exports = router;


