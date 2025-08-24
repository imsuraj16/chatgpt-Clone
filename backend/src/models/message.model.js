const mongoose = require('mongoose');


const messageSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },

    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'chats'
    },
    message: {
        type: String,
        required: true
    },

    role: {
        type: String,
        enum: ['user', 'model'],
        default: 'user'
    }
}, { timestamps: true })

const messageModel = mongoose.model('Messages', messageSchema)

module.exports = messageModel