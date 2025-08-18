const chatModel = require('../models/chat.model')


const createChat = async (req, res) => {

    const { title } = req.body
    const user = req.user

    const chat = await chatModel.create({
        title, user: user._id
    })

    res.status(201).json({  
        msg : "chat created",
        chat :{
            _id : chat._id,
            title : chat.title,
            user : chat.user,
            lastActivity : chat.lastActivity
        }
    })
}

module.exports = createChat