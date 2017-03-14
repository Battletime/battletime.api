var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Event = mongoose.model("Event");
var eventCtrl = new require('../controllers/EventController')();


/* GET home page. */
router.get('/setup', function(req, res) {

    Event.remove({}).exec( (err) => {
        
        eventCtrl.create({
            name: "TestEvent",
            Date: new Date()
        }).then( (err, event) => {
            res.json({ result: "setup complete" });
        });

    });

});

module.exports = router;
