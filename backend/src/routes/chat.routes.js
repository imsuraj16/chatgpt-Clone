const express = require('express');
const { createChat, getChats, getChatMessages } = require('../controllers/chat.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();



router.post('/', authMiddleware, createChat)
router.get('/', authMiddleware, getChats)
router.get('/:chatId/messages', authMiddleware, getChatMessages)





module.exports = router;