/**
 *  MODEL: 'demoarticles'
 *  Defining a schema to store an article into MongoDB.
 */

//Setup Mongoose
let mongoose = require('mongoose');


//MongoDB Scheme Deign '
let articleSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    }
})

let ArticleSchema = module.exports = mongoose.model('demoarticles' /* Collection Name in MongoDB */, articleSchema);