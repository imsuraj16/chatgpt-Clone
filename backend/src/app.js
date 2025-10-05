const express = require('express');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth.routes');
const chatRoutes = require('./routes/chat.routes');
const cors = require('cors');


const app = express()
app.use(cors({
    origin : process.env.CORS_ORIGIN,
    credentials : true,
    allowedHeaders : ["Authorization", "Content-Type"],
    methods : ["GET","POST"],
}))
app.use(express.json())
app.use(cookieParser())


//auth**routes**//


app.use('/api/auth',authRoutes)

//chat-routes//

app.use('/api/chat',chatRoutes)


module.exports = app