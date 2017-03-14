var mongoose = require('mongoose');

module.exports = function(app, data){

    app.use('/',  require('./home'));
    app.use('/test',  require('./test'));
    app.use('/events',  require('./events'));
    app.use('/auth', require('./auth'));

}