/**
 *  MODEL: 'demouser'
 *  Defining a schema to store an article into MongoDB.
 */

const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    username:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    }
})

const UserSchema = module.exports = mongoose.model('demouser', userSchema);