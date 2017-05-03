var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt   = require('bcrypt-nodejs');
var jwt = require('jwt-simple');

var userSchema = new Schema({ 
    name: String, 
    imageUri: String,
    username: { type: String, unique: true, required: true },
    email: String,
    password:String,
    role: String, 
});

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    console.log(password);
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// methods ======================
// compare a hash
userSchema.methods.compareHash = function(password) {
    console.log(password);
    var areEqual = bcrypt.compareSync(password, this.password);
    console.log(areEqual);
    return areEqual; 
};

userSchema.statics.random = function(userId, callback) {
  this.count(function(err, count) {
    var rand = Math.floor(Math.random() * count);
    this.findOne().skip(rand)
        .exec((err, user) => {            
            if(user._id != userId)
                callback(err, user);
            else
                this.random(userId, callback);
        });
  }.bind(this));
};

userSchema.pre('save', function(next) {
    if(!this.imageUri){
        var min = Math.ceil(1);
        var max = Math.floor(9);
        this.imageUri = "/images/hero_" + (Math.floor(Math.random() * (max - min)) + min + ".png");
    }
    next();
});


userSchema.methods.toToken = function(){
    //user has authenticated correctly thus we create a JWT token 
    var token = jwt.encode({ username: this._id, role: this.role}, "pointypony");

    return { 
        _id: this._id,
        username: this.username,
        token: token,
        role: this.role,
        imageUri: this.imageUri
    };
}

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('User', userSchema);

