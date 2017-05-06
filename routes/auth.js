var router = require('express').Router();
var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');

router.post('/signup', function(req, res, next){

    // we are checking to see if the user trying to login already exists
    User.findOne({ 'email': req.body.email.toLowerCase() }, function(err, user) {

        // if there are any errors, return the error
        if (err)
            return res.status(500).send({ form: { username: req.body.username}, errors: ["Ow noes! Something went wrong!"]});

        // check to see if theres already a user with that username
        if (user) {
              return res.status(400).send({errors: ["That email is already taken."]});
        } else {

            // if there is no user with that username
            // create the user
            var newUser = new User();

            // set the user's local credentials
            newUser.username =  req.body.username;
            newUser.email = req.body.email.toLowerCase();
            newUser.password = newUser.generateHash(req.body.password);
            newUser.role = "user";

            newUser.save(function(err, user){
                if(err){
                    return res.status(500).send({ form: err, errors: ["Oops, something went wrong!"]});
                }

                res.json(user.toToken()); 
            });


        }
    });    
});
  

router.post('/login', function(req, res, next) {
    
    // we are checking to see if the user trying to login already exists
    User.findOne({ 'email' :  req.body.email.toLowerCase() }, function(err, user) {

        if(!user){
             return res.status(401).json({ errors: ['Wrong credentials'] });
        }

        console.log(user);

        if(!user.compareHash(req.body.password)){
            return res.status(401).json({ errors: ['Wrong credentials' ]});
        }
        else{
            res.json(user.toToken());
        }

    })
});

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


