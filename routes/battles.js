var express = require('express');
var router = express.Router();
var battleCtrl = require('../controllers/BattleController')();

/* GET users listing. */
router.get('/', function(req, res, next) {
  battleCtrl.get().then((battles) => {
        res.send(battles);
    }, (err) => res.status(500).send());
});

router.post('/', (req, res) => {
    battleCtrl.create(req.body).then( (battle) => {
        battleCtrl.getDetails(battle._id).then( (battle) => {
             res.send(battle);
        }) 
    }, (err) => res.status(500).send());
});


module.exports = router;
