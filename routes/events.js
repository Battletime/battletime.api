var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Event = mongoose.model("Event");
var eventCtrl = require('../controllers/EventController')();

/* GET home page. */
router.get('/', function(req, res, next) {
    eventCtrl.get().then( (events) => {
        res.json(events);
    });
});

router.get('/:id', (req, res) => {
    eventCtrl.getDetails(req.params.id).then( (event) => {
        res.json(event);
    });
});

router.post('/:secret/participants', (req, res) => {
    eventCtrl.signUp(req.params.secret, req.body.userId).then( (event) => {
        res.json(event);
    });
});



module.exports = router;
