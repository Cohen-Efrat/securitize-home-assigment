const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    firstName:{type: String},
    lastName:{type: String},
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true
    },
    favorites:{ type : Array , "default" : [] }
}, {
    timestamps: true
})
const User = mongoose.model('User', userSchema)

module.exports = User