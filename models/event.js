var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var eventSchema = new Schema({ 
    name: String, 
    secret: String,
    startedOn: Date,
    stoppedOn: Date,
    type: { type: String, required: true},
    participants: [{ type: String, ref: "User" }]
});

eventSchema.methods.reset = function(){
    this.startedOn = null; 
    this.stoppedOn = null;
}

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('Event', eventSchema);

