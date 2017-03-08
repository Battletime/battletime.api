var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {


    var events = [
       { name: "Be a superhero jam", date: new Date(), QR: "abc"}
    ]
    res.json(events);
});

module.exports = router;
