var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var schemaOptions = {
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  },
  usePushEach: true
};

var eventSchema = new Schema(
  {
    name: String,
    secret: String,
    startedOn: Date,
    stoppedOn: Date,
    type: { type: String, required: true },
    participants: [{ type: String, ref: "User" }],
    winners: [
      {
        user: { type: String, ref: "User" },
        place: String
      }
    ]
  },
  schemaOptions
);

eventSchema.methods.reset = function() {
  this.startedOn = null;
  this.stoppedOn = null;
};

eventSchema.virtual("status").get(function() {
  if (!this.startedOn) return { id: 0, text: "Not started" };
  if (!this.stoppedOn) return { id: 1, text: "In progress" };
  else return { id: 2, text: "Finished" };
});

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model("Event", eventSchema);
