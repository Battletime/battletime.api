var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({ 
    _id: String,
    name: String, 
    googleImageUri: String,
    userName: String,
    password:String,
    role: String, 
});

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('User', userSchema);

