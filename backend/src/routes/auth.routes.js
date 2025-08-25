const express = require('express');
const { registerUser, loginUser, getLoggedInUser, logoutUser } = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/signup', registerUser);
router.post('/login', loginUser);
router.get('/me', authMiddleware, getLoggedInUser);
router.get('/logout', logoutUser);

module.exports = router;