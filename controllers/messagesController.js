// messageController.js

const { MongoClient } = require("mongodb");
const uri = "mongodb+srv://lillaundry:Antib7iotics!@sethcluster.lbpora8.mongodb.net/?retryWrites=true&w=majority&appName=SethCluster";

// Function to get messages by topic ID
async function getMessagesByTopicId(topicId) {
    try {
        const client = new MongoClient(uri);
        await client.connect();
        const db = client.db('Sethdb');
        const topics = db.collection('topics');

        // Find the topic by ID
        const topic = await topics.findOne({ _id: ObjectId(topicId) });
        await client.close();

        if (!topic) {
            return null;
        }

        return topic.messages || [];
    } catch (error) {
        console.error('Error fetching messages:', error);
        throw new Error('Internal Server Error');
    }
}
// Function to create a message for a specific topic
async function createMessage(req, res) {
    try {
        const topicId = req.params.topicId;
        const { message } = req.body;
        
        const client = new MongoClient(uri);
        await client.connect();
        const db = client.db('Sethdb');
        
        // Assuming you have a collection named 'topics'
        const result = await db.collection('topics').findOneAndUpdate(
            { _id: topicId },
            { $push: { messages: message } }
        );
        
        await client.close();
        
        res.redirect('/topics'); // Redirect to topics page
    } catch (error) {
        console.error('Error creating message:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = {
    createMessage,
    getMessagesByTopicId,
};
