// messagesRoutes.js
const express = require('express');
const router = express.Router();
const messagesController = require('../controllers/messagesController');

// Route to handle creation of messages for a topic
router.post('/:topicId', messagesController.createMessage);

module.exports = router;

