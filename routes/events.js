var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Event = mongoose.model("Event");
var eventCtrl = require('../controllers/EventController')();

/* GET home page. */
router.get('/', function(req, res, next) {
    eventCtrl.get().then( (events) => {
        res.send(events);
    }, (err) => res.status(500).send());
});

router.get('/:id', (req, res) => {
    eventCtrl.getDetails(req.params.id).then( (event) => {
        res.send(event);
    }, (err) => res.status(500).send());
});

router.post('/', (req, res) => {
    eventCtrl.create(req.body).then( (event) => {
        res.send(event);
    }, (err) => res.status(500).send());
});

router.post('/:id/actions', (req, res) => {

    eventCtrl.action(req.params.id, req.body.action).then((event) => {
        res.send(event);
    }, (err) => res.status(500).send());

});

router.put("/:id/battles", (req, res) => {
    eventCtrl.generateBattles(req.params.id).then((battles) => {
        res.send(battles);
    }, (err) => res.status(500).send());
});

router.post('/:id/participants', (req, res) => { 
    eventCtrl.signUp(req.params.id, req.body).then( (event) => {     
        eventCtrl.getDetails(req.params.id).then( (event) => {
            req.broadcast.signup(event.participants);
            res.send(event.participants);
        }, (err) => res.status(500).send());
    }, (err) => res.status(500).send());
});


module.exports = router;
