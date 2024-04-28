// Import necessary modules and models
const User = require('../models/User');
const Topic = require('../models/Topic');

// UserController object
const UserController = {
  // Register a new user
  register: async (req, res) => {
    try {
      const { username, email, password } = req.body;
      // Check if username or email already exists
      const existingUser = await User.findOne({ $or: [{ username }, { email }] });
      if (existingUser) {
        return res.status(400).json({ message: 'Username or email already exists' });
      }
      // Create a new user
      const newUser = new User({ username, email, password });
      await newUser.save();
      return res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error('Error registering user:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  },

  // Login user
  login: async (req, res) => {
    try {
      const { username, password } = req.body;
      // Check if user exists
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      // Check password
      const validPassword = await user.comparePassword(password);
      if (!validPassword) {
        return res.status(401).json({ message: 'Invalid password' });
      }
      // Generate and return JWT token
      const token = user.generateToken();
      return res.status(200).json({ token });
    } catch (error) {
      console.error('Error logging in user:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  },

  // Subscribe to a topic
  subscribeTopic: async (req, res) => {
    try {
      const { userId } = req.user; // Extract user ID from JWT token
      const { topicId } = req.body;
      // Check if user and topic exist
      const [user, topic] = await Promise.all([
        User.findById(userId),
        Topic.findById(topicId),
      ]);
      if (!user || !topic) {
        return res.status(404).json({ message: 'User or topic not found' });
      }
      // Subscribe user to the topic
      user.subscribeToTopic(topicId);
      return res.status(200).json({ message: 'Subscribed to topic successfully' });
    } catch (error) {
      console.error('Error subscribing to topic:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  },

  // Unsubscribe from a topic
  unsubscribeTopic: async (req, res) => {
    try {
      const { userId } = req.user; // Extract user ID from JWT token
      const { topicId } = req.body;
      // Check if user and topic exist
      const [user, topic] = await Promise.all([
        User.findById(userId),
        Topic.findById(topicId),
      ]);
      if (!user || !topic) {
        return res.status(404).json({ message: 'User or topic not found' });
      }
      // Unsubscribe user from the topic
      user.unsubscribeFromTopic(topicId);
      return res.status(200).json({ message: 'Unsubscribed from topic successfully' });
    } catch (error) {
      console.error('Error unsubscribing from topic:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
};

module.exports = UserController;