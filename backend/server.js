require('dotenv').config()
const app = require('./src/app');
const connectDB = require('./src/db/db');
connectDB();
const socketInit = require('./src/socket/socket.server');
const { createServer } = require("http");
const httpServer = createServer(app);
socketInit(httpServer);


httpServer.listen(3000, () => {
    console.log("Server is running on port 3000");
});