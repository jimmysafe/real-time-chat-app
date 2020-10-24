const mongoose = require('mongoose')

const Schema = mongoose.Schema

const MessageSchema = new Schema({
    user: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Message', MessageSchema)