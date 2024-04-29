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

        // Fetch messages for each topic
        const topicsWithMessages = await Promise.all(allTopics.map(async topic => {
            const messages = await getMessagesByTopicName(topic.name); // Corrected here
            topic.messages = messages;
            return topic;
        }));

        return topicsWithMessages;
    } catch (error) {
        console.error('Error fetching topics with messages:', error);
        throw new Error('Internal Server Error');
    }
}

async function getMessagesByTopicName(topicName) {
    try {
        const client = new MongoClient(uri);
        await client.connect();
        const db = client.db('Sethdb');
        const messages = db.collection('messages');

        // Find messages for the given topic name
        const topicMessages = await messages.find({ topic: topicName }).toArray();
        return topicMessages;
    } catch (error) {
        console.error(`Error fetching messages for topic ${topicName}:`, error);
        throw new Error('Internal Server Error');
    }
}

async function createTopic(req, res) {
    try {
        // Extract topic details from request body
        const { name, message } = req.body;

        // Connect to MongoDB
        const client = new MongoClient(uri);
        await client.connect();
        const db = client.db('Sethdb');
        const topics = db.collection('topics');

        // Check if topic with the given name already exists
        const existingTopic = await topics.findOne({ name });

        if (existingTopic) {
            // Update existing topic by adding the new message
            await topics.updateOne({ name }, { $push: { messages: message } });
        } else {
            // Create a new topic with the message
            await topics.insertOne({ name, messages: [message] });
        }

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


module.exports = {
    getAllTopicsWithMessages,
    createTopic
};
