var mongoose = require('mongoose');

module.exports = function(app, data){

    app.use('/',  require('./portal'));
    app.use('/api/test',  require('./test'));
    app.use('/api/events',  require('./events'));
    app.use('/api/auth', require('./auth'));

}