const chatModel = require('../models/chat.model');

const createChat = async (req, res) => {

    const { title } = req.body;

    try {
        const chat = await chatModel.create({
            title, user: req.user._id
        })

        res.status(201).json({
            title: chat.title,
            user: chat.user
        })
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }

}

module.exports = { createChat }