const mongoose = require('mongoose')
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
    },
    name:{
        type:String
    },
    password:{
        type:String,
        required:true,
        minLen:5,
    },
    refreshToken:{
        type:String,
        unique:true,
        default: uuidv4,
    }
})

const saltRounds = 10;
userSchema.pre('save', function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  bcrypt.genSalt(saltRounds, (err, salt) => {
    if (err) {
      return next(err);
    }

    bcrypt.hash(this.password, salt, (err, hash) => {
      if (err) {
        return next(err);
      }

      this.password = hash;
      next();
    });
  });
});

const User = mongoose.model('User', userSchema)

module.exports = User