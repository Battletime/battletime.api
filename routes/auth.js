var router = require('express').Router();
var passport = require('passport');

router.get('/google', passport.authenticate('google', { scope: 'https://www.google.com/m8/feeds' }));

router.get('/google/callback', function(req, res){



});

module.exports = router;


