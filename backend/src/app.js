const express = require('express')
const cookieParser = require('cookie-parser')
const userRoutes = require('./routes/auth.routes')
const chatRoutes = require('./routes/chat.route')


const app = express()
app.use(cookieParser())
app.use(express.json())
app.use('/api/auth',userRoutes)
app.use('/api/chat',chatRoutes)




module.exports = app
