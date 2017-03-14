var express = require('express');
var router = express.Router();
var eventCtrl = require('../controllers/EventController')();

/* GET home page. */
router.get('/', function(req, res, next) {
    eventCtrl.get().then( (events) => {
        res.render('events', { events: events });
    });
});

//same as index
router.get('/events', function(req, res, next) {
    eventCtrl.get().then( (events) => {
        res.render('events', { events: events });
    });
});


router.get('/events/:eventId', function(req, res, next) {
      eventCtrl.getDetails(req.params.eventId).then( (event) => {
        res.render('event', { event: event });
    });
});

module.exports = router;
