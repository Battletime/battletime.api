var express = require('express');
var router = express.Router();
var userCtrl = require('../controllers/UserController')();

/* GET users listing. */
router.get('/', function(req, res, next) {
  userCtrl.get().then( (users) => {
        res.send(users);
    }, (err) => res.status(500).send());
});

/* GET users listing. */
router.post('/', function(req, res, next) {
  userCtrl.create(req.body).then( (user) => {
        res.send(user);
    }, (err) => res.status(500).send());
});


module.exports = router;
