var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var _ = require('underscore');

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
    winner: { type: String, ref: "User" },
    participants: [{ type: String, ref: "User" }],
    votes: [{ 
        byUserId: { type: String, require: true} ,
        forUserId: { type: String, require: true},
        timestamp: { type: String, require: true }
    }]
}, schemaOptions);

battleSchema.methods.reset = function(){
    this.startedOn = null; 
    this.stoppedOn = null;
}

battleSchema.methods.containsVoteOf = function(userId){
    var matches = _.filter(this.votes, function(vote){ 
        if (vote.byUserId == userId){ 
            return vote;
        } 
    });
    return matches.length != 0;
}

battleSchema.methods.decideWinner = function(){
    //ik ga er nu even vanuit dat er maximaal 2 votes zijn
    if(this.votes[0].forUserId == this.votes[1].forUserId){
        this.winner = this.votes[0].forUserId;
    }
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

