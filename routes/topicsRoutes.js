const express = require('express');
const router = express.Router();
const topicsController = require('../controllers/topicsController');

router.get('/topics', async (req, res) => {
    try {
        const topics = await topicsController.getAllTopicsWithMessages();
        const user = req.user; // Assuming user info is available in req.user
        res.render('topics', { topics, user });
    } catch (error) {
        console.error('Error fetching topics:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/topics', async (req, res) => {
    try {
        const { action, topicName } = req.body;
        const user_ID = req.user._id; // Assuming user ID is available in req.user
        if (action === 'subscribe') {
            await topicsController.subscribeToTopic(user_ID, topicName);
            // Add the topic to the user's subscribedTopics array
            await topicsController.addToSubscribedTopics(user_ID, topicName);
        } else if (action === 'unsubscribe') {
            await topicsController.unsubscribeFromTopic(user_ID, topicName);
            // Remove the topic from the user's subscribedTopics array
            await topicsController.removeFromSubscribedTopics(user_ID, topicName);
        } else {
            // Handle other actions or topic-related operations
        }
        res.redirect('/topics');
    } catch (error) {
        console.error('Error subscribing/unsubscribing to topic:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/topics', topicsController.createTopic);

module.exports = router;
