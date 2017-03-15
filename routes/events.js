var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Event = mongoose.model("Event");
var eventCtrl = require('../controllers/EventController')();

/* GET home page. */
router.get('/', function(req, res, next) {
    eventCtrl.get().then( (events) => {
        res.send(events);
    });
});

router.get('/:id', (req, res) => {
    eventCtrl.getDetails(req.params.id).then( (event) => {
        res.send(event);
    });
});

router.post('/:secret/participants', (req, res) => {
    var userId = 1;  //get user id from session
    eventCtrl.signUp(req.params.secret, userId).then( (event) => {
        req.broadcast.signup(2);
        res.send(event);
    });
});



module.exports = router;
