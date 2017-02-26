var mongoose = require('mongoose');
var {Schema} = require('mongoose');
var bcrypt = require('bcrypt');

var UserSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    favoriteBook: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    }
})

UserSchema.pre('save', function(next){
    var user = this;
    bcrypt.hash(user.password, 10, function(err, hash){
        if(err){
            return next(err);
        } else {
            user.password = hash;
            return next()
        }
    })
});

module.exports = mongoose.model('users', UserSchema);
