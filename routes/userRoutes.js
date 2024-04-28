const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');

// Route for user registration
router.post('/register', UserController.register);

// Route for user login
router.post('/login', UserController.login);

// Route for subscribing to a topic
router.post('/subscribe', UserController.subscribeTopic);

// Route for unsubscribing from a topic
router.post('/unsubscribe', UserController.unsubscribeTopic);

module.exports = router;