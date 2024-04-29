// routes/topicsRoutes.js

const express = require('express');
const router = express.Router();
const path = require('path'); 
const topicsController = require('../controllers/topicsController');

// Define route for viewing topics
router.get('/topics', async (req, res) => {
    try {
        // Fetch all topics with messages
        const topics = await topicsController.getAllTopicsWithMessages();
        // Render the topics page with topics data
        res.render('topics', { topics });
    } catch (error) {
        console.error('Error fetching topics:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to create a new topic
router.post('/topics', topicsController.createTopic);

module.exports = router;
