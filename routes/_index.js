var mongoose = require('mongoose');

module.exports = function(app, data){

    app.get('/', function(req, res, next){
        res.render('index', { layout: false });
    });

    app.use('/api/test',  require('./test'));
    app.use('/api/events',  require('./events'));
    app.use('/api/auth', require('./auth'));

}