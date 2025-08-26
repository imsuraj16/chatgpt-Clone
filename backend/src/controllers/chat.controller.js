const chatModel = require('../models/chat.model');
const messageModel = require('../models/message.model');

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

const getChats = async (req, res) => {

    const chats = await chatModel.find({ user: req.user._id })
    res.status(200).json(chats)
}

const getChatMessages = async (req, res) => {
    try {
        const { chatId } = req.params;
        const messages = await messageModel.find({ chat: chatId }).sort({ createdAt: 1 });
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = {
    createChat,
    getChats,
    getChatMessages
}
