
module.exports = function(app, server){

    var broadcast = null;

    //retrieve http-server from app
    var io = require('socket.io')(server);
    broadcast = require('./broadcastService')(io);
    io.on('connection', function(socket){
        
    });

    app.set('broadcast', broadcast);    
}
