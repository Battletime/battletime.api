var express = require('express');
var router = express.Router();
var battleCtrl = require('../controllers/BattleController')();

/* GET users listing. */
router.get('/', function(req, res, next) {
  battleCtrl.get().then((battles) => {
        res.send(battles);
    }, (err) => res.status(500).send());
});

/* GET users listing. */
router.get('/:battleId', function(req, res, next) {
  battleCtrl.getDetails(req.params.battleId).then((battle) => {
        res.send(battle);
    }, (err) => res.status(500).send());
});


router.get('/me', function(req, res, next) {
  battleCtrl.getMyBattles().then((battles) => {
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

router.post('/:id/actions', (req, res) => {

    battleCtrl.action(req.params.id, req.body.action).then((battle) => {
         battleCtrl.getDetails(battle._id).then( (battle) => {
             res.send(battle);
        }) 
    }, (err) => res.status(500).send());
});


router.post('/:id/votes', (req, res) => {
    battleCtrl.vote(req.params.id, req.body).then((battle) => {
         battleCtrl.getDetails(battle._id).then( (battle) => {
             res.send(battle);
        }) 
    }, (err) => res.status(500).send());

});

router.post('/random/:userId', (req, res) => {
    battleCtrl.createRandom(req.params.userId).then((battle) => {
        battleCtrl.getDetails(battle._id).then( (battle) => {
             res.send(battle);
        }) 
    });
});



module.exports = router;
