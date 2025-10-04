const express = require('express');
const { registerUser, loginUser, getLoggedInUser, logoutUser } = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/signup', registerUser);
router.post('/login', loginUser);
router.get('/me', authMiddleware, getLoggedInUser);
// Support both GET and POST for logout (frontend currently uses POST)
router.get('/logout', logoutUser);
router.post('/logout', logoutUser);

module.exports = router;