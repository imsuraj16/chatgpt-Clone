const mongoose = require('mongoose')


const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('db connected');
    } catch (error) {
        console.log('not connected', error);

    }

}

module.exports = connectDB