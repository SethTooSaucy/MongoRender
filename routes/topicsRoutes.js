// topicsRoutes.js

const express = require('express');
const router = express.Router();
const topicsController = require('../controllers/topicsController');

// Route to get all topics
router.get('/topics', topicsController.getAllTopicsWithMessages);
// Define a route to get all topics

// Route to create a new topic
router.post('/topics', topicsController.createTopic);

module.exports = router;
