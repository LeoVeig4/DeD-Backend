const mongoose = require('mongoose')

const User = mongoose.model('User', {
    //Id: Number,
    name: String,
    email: String,
    password: String
})

module.exports = User