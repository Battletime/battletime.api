var express = require('express');
var router = express.Router();
var userCtrl = require('../controllers/UserController')();
var battleCtrl = require('../controllers/BattleController')();
var eventCtrl = require('../controllers/EventController')();

/* GET users listing. */
router.get('/', function(req, res, next) {
  userCtrl.get().then( (users) => {
        res.send(users);
    }, (err) => res.status(500).send());
});

/* POST update the avatar */
router.post('/:id/avatar', function(req, res, next) {
    console.log("starting upload of avatar!");
    res.send("test");
    // userCtrl.uploadAvatar(req.params.id, req.body).then( (user) => {
    //     res.send(user);
    // }, (err) => res.status(500).send(err));
});

/* GET battles of user */
router.get('/:id/battles', function(req, res, next) {
  battleCtrl.getMyBattles(req.params.id).then( (battles) => {
        res.send(battles);
    }, (err) => res.status(500).send());
});

/* GET battles of user */
router.get('/:id/events', function(req, res, next) {
  eventCtrl.getMyEvents(req.params.id).then( (events) => {
        res.send(events);
    }, (err) => res.status(500).send());
});



/* GET users listing. */
router.post('/', function(req, res, next) {
  userCtrl.create(req.body).then( (user) => {
        res.send(user);
    }, (err) => res.status(500).send());
});


module.exports = router;
