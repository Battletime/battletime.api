var mongoose = require('mongoose');

module.exports = function(app, data){

    app.use('/api/test',  require('./test'));
    app.use('/api/events',  require('./events'));
    app.use('/api/auth', require('./auth'));
    app.use('/api/users', require('./users'));
}