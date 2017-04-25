var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt   = require('bcrypt-nodejs');
var jwt = require('jwt-simple');

var userSchema = new Schema({ 
    name: String, 
    ImageUri: String,
    username: { type: String, unique: true },
    email: String,
    password:String,
    role: String, 
});

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// methods ======================
// compare a hash
userSchema.methods.compareHash = function(password) {
    console.log(this.password);
    var areEqual = bcrypt.compareSync(password, this.password);
    console.log(areEqual);
    return areEqual; 
};


userSchema.methods.toToken = function(){
    //user has authenticated correctly thus we create a JWT token 
    var token = jwt.encode({ username: this.username}, "pointypony");

    return { 
        username: this.username,
        token: token
    };
}

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('User', userSchema);

