const mongoose = require('mongoose');



const chatSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
    },

    lastActivity: {
        type: Date,
        default: Date.now
    }
    
}, { timestamps: true })


const chatModel = mongoose.model('chats', chatSchema);


module.exports = chatModel;