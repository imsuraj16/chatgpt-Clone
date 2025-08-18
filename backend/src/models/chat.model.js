const mongoose = require('mongoose')



const chatSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    title: {
        type: String,
        required: true
    },
    lastActivity: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true })

const chatModel = mongoose.model('Chats', chatSchema)

module.exports = chatModel