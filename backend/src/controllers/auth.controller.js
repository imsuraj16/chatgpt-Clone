const userModel = require("../models/user.model");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const registerUser = async (req, res) => {

    const { fullName: { firstName, lastName }, email, password } = req.body;

    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
    }

    const newUser = await userModel.create({
        fullName: { firstName, lastName },
        email,
        password: await bcrypt.hash(password, 10)
    })

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
    res.cookie("token", token);

    const { password: _, ...userWithoutPassword } = newUser.toObject();

    res.status(201).json({ message: "User registered successfully", user: userWithoutPassword });

};

const loginUser = async (req, res) => {

    const { email, password } = req.body;

    const user = await userModel.findOne({ email })

    if (!user) {
        return res.status(404).json({ message: "invalid username or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
        return res.status(404).json({ message: "invalid username or password" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
    res.cookie("token", token);

    const { password: __, ...userWithoutPassword } = user.toObject();

    res.status(200).json({ message: "User logged in successfully", user: userWithoutPassword });
}

const getLoggedInUser = async (req, res) => {
    // req.user is attached by authMiddleware
    const user = await userModel.findById(req.user._id).select("-password");
    res.status(200).json({ user });
};

const logoutUser = (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ message: "User logged out successfully" });
};


module.exports = { registerUser, loginUser, getLoggedInUser, logoutUser };
