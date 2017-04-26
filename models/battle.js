var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var battleSchema = new Schema({ 
    event: { type: String, ref: "Event" }, 
    startedOn: Date,
    stoppedOn: Date,
    participants: [{ type: String, ref: "User" }]
});

battleSchema.methods.reset = function(){
    this.startedOn = null; 
    this.stoppedOn = null;
}

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('Battle', battleSchema);

