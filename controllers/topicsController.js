// topicsController.js

const { MongoClient } = require("mongodb");
const uri = "mongodb+srv://lillaundry:Antib7iotics!@sethcluster.lbpora8.mongodb.net/?retryWrites=true&w=majority&appName=SethCluster";

async function getAllTopicsWithMessages() {
    try {
        const client = new MongoClient(uri);
        await client.connect();
        const db = client.db('Sethdb');
        const topics = db.collection('topics');

        // Find all topics
        const allTopics = await topics.find({}).toArray();
        await client.close();

        // Fetch messages for each topic
        const topicsWithMessages = await Promise.all(allTopics.map(async topic => {
            topic.messages = await messagesController.getMessagesByTopicId(topic._id);
            return topic;
        }));

        return topicsWithMessages;
    } catch (error) {
        console.error('Error fetching topics with messages:', error);
        throw new Error('Internal Server Error');
    }
}

// Function to create a new topic
async function createTopic(req, res) {
    try {
        // Extract topic details from request body
        const { name } = req.body;

        // Connect to MongoDB
        const client = new MongoClient(uri);
        await client.connect();
        const db = client.db('Sethdb'); // Change to your database name
        const topics = db.collection('topics'); // Create a collection named 'topics'

        // Insert the new topic into the database
        await topics.insertOne({ name, messages: [] });

        await client.close();

        res.redirect('/topics');
    } catch (error) {
        console.error('Error creating topic:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = {
    getAllTopicsWithMessages,
    createTopic
};
