var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schemaOptions = {
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true 
  }
};

var battleSchema = new Schema({ 
    event: { type: String, ref: "Event" }, 
    startedOn: Date,
    stoppedOn: Date,
    participants: [{ type: String, ref: "User" }]
}, schemaOptions);

battleSchema.methods.reset = function(){
    this.startedOn = null; 
    this.stoppedOn = null;
}

battleSchema.virtual('status').get(function(){
    if(!this.startedOn)
        return { id: 0, text: "Not started" };
    if(!this.stoppedOn)
        return { id: 1, text: "In progress" }; 
    else
        return { id: 2, text: "Finished" }; 
});


// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('Battle', battleSchema);

