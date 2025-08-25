const { Server } = require("socket.io");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const { generateContent, generateEmbeddings } = require("../service/ai.service");
const messageModel = require("../models/message.model");
const userModel = require("../models/user.model.js");
const { createMemoryVector, queryMemory } = require("../service/vector.service");


const socketInit = (httpServer) => {
    const io = new Server(httpServer, {
        cors: {
            origin: "http://localhost:5173",
            credentials: true,
            methods: ["GET", "POST"]
        }
    });

    

    io.use(async (socket, next) => {
        const cookies = cookie.parse(socket.handshake.headers?.cookie || "")

        if (!cookies.token) {
            next(new Error("Unauthorized user"))

        }

        try {
            const decoded = jwt.verify(cookies.token, process.env.JWT_SECRET)
            const user = await userModel.findById(decoded.id)
            socket.user = user
            next()
        } catch (error) {
            next(new Error("Unauthorized"))
        }

    })

    io.on("connection", (socket) => {

        console.log('user connected');

        socket.on('ai-msg', async (messagePayload) => {

            const savedMessage = await messageModel.create({
                message: messagePayload.message,
                user: socket.user._id,
                chat: messagePayload.chat,
                role: 'user'
            })

            const vectors = await generateEmbeddings(messagePayload.message)

            await createMemoryVector(savedMessage._id, vectors, { message: messagePayload.message, chat: messagePayload.chat, user: socket.user._id, role: savedMessage.role })


            const chatmessage = (await messageModel.find({
                chat: messagePayload.chat
            }).sort({ createdAt: -1 }).limit(3).lean()).reverse()

            const queryMathces = await queryMemory(vectors, 3)

            const ltm = queryMathces.map((item) => {
                return {
                    role: item.metadata.role,
                    parts: [{ text: item.metadata.message }]
                }

            })


            const stm = chatmessage.map((item) => {
                return {
                    role: item.role,
                    parts: [{ text: item.message }]
                }
            })



            const response = await generateContent([...ltm,...stm])

            const savedResponse = await messageModel.create({
                message: response,
                user: socket.user._id,
                chat: messagePayload.chat,
                role: 'model'
            })

            const responseVectors = await generateEmbeddings(response)

            await createMemoryVector(savedResponse._id, responseVectors, { message: response, chat: messagePayload.chat, user: socket.user._id, role: savedResponse.role })

            socket.emit('ai-response', response)
        })

    })
}

module.exports = socketInit;






// can you tell which library we have discussed before ?,and there related questions which i asked from you?