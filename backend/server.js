require('dotenv').config()
const app = require('./src/app')
const connectDB = require('./src/db/db')
const { createServer } = require("http");
connectDB()
const initSocket = require('./src/socket/socket.server')
const httpServer = createServer(app)
initSocket(httpServer)

httpServer.listen(3000,()=>{
    console.log('server is running');
    
})