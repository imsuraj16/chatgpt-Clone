const { Server } = require("socket.io");
const cookie = require('cookie')
const jwt = require('jsonwebtoken');
const userModel = require("../models/user.model");
const generateResponse = require('../service/ai.service');
const messageModel = require("../models/message.model");


function initSocket(httpServer) {

    const io = new Server(httpServer, { /* options */ });
    io.use(async (socket, next) => {
        const cookies = cookie.parse(socket.handshake.headers?.cookie || "");

        if (!cookies.token) {
            next(new Error("Authentication error: No token provided"));
        }

        try {
            const decoded = jwt.verify(cookies.token, process.env.JWT_SECRET)
            const user = await userModel.findById(decoded.id)
            socket.user = user
            next()
        } catch (error) {
            next(new Error("Authentication error: Invalid token"));
        }
    })

    io.on('connection', (socket) => {

        socket.on('ai-msg', async (messagePayload) => {

             await messageModel.create({
                user : socket.user._id,
                chat : messagePayload.chat,
                message : messagePayload.message,
                role : 'user'
            })

            const chatHistory = await messageModel.find({
                chat:messagePayload.chat
            })
            console.log(chatHistory);
            
       
            

            const response = await generateResponse(messagePayload.message)

            await messageModel.create({
                user : socket.user._id,
                chat : messagePayload.chat,
                message : response,
                role : 'model'
            })

            socket.emit('ai-response', {
                reply: response,
                chat: messagePayload.chat
            })
        })
    })
}


module.exports = initSocket