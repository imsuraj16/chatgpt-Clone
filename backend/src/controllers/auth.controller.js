const userModel = require("../models/user.model");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const registerUser = async (req, res) => {

    const { fullName: { firstName, lastName }, email, password } = req.body

    const existingUser = await userModel.findOne({ email })

    if (existingUser) {
       return res.status(400).json({
            msg: "user already exists"
        })
    }

    const newUser = await userModel.create({
        fullName: { firstName, lastName }, email, password: await bcrypt.hash(password, 10)
    })

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET)
    res.cookie("token", token)

    res.status(201).json({
        msg: "new user created",
        newUser
    })

}

const loginUser = async (req, res) => {

    const { email, password } = req.body

    const user = await userModel.findOne({ email })

    if (!user) {
      return res.status(400).json({
            msg: "invalid username or password"
        })
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password)

    if (!isPasswordCorrect) {
      return res.status.json({
            msg: "invalid username or password"
        })
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
    res.cookie("token", token)

    res.status(200).json({
        msg: "user loggedin successfully."
    })
}



module.exports = {
    registerUser,
    loginUser
}