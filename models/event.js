var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('Event', new Schema({ 
    name: String, 
    secret: String,
    date: Date,
    participants: [{ type: String, ref: "user" }]
}));