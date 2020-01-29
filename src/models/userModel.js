import bcrypt from 'bcryptjs';

let salt = bcrypt.genSaltSync(10);
let mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const ObjectId = mongoose.Schema.Types.ObjectId;

export const UserSchema = new Schema({
    username: {
        type: String,
        required: 'Username required'
    },
    password: {
        type: String,
        required: 'Password required'
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    races:[{
        type: ObjectId,
        ref: 'Race',
        autopopulate: true
    }]
});

UserSchema.pre('save', function(next) {
    let user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    user.password = bcrypt.hashSync(user.password, salt);
    next();
});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

UserSchema.plugin(require('mongoose-autopopulate'));