// authController.js

const path = require('path');
const { MongoClient } = require("mongodb");
const crypto = require('crypto');
const uri = "mongodb+srv://lillaundry:Antib7iotics!@sethcluster.lbpora8.mongodb.net/?retryWrites=true&w=majority&appName=SethCluster";

// Function to render the register form
function renderRegisterForm(req, res) {
    res.sendFile(path.join(__dirname, '..', 'views', 'register.html'));
}

// Function to render the login form
function renderLoginForm(req, res) {
    res.sendFile(path.join(__dirname, '..', 'views', 'login.html'));
}

// Function to handle user registration
async function registerUser(req, res) {
    try {
        // Extract user details from request body
        const { user_ID, password } = req.body;

        // Hash the password using custom hashing function
        const hashedPassword = hashPassword(password);

        // Connect to MongoDB
        const client = new MongoClient(uri);
        await client.connect();
        const db = client.db('Sethdb'); // Change to your database name
        const users = db.collection('users'); // Create a collection named 'users'

        // Check if the user already exists
        const existingUser = await users.findOne({ user_ID });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Insert the new user into the database
        await users.insertOne({ user_ID, password: hashedPassword });
        await client.close();

        // Redirect to homepage after successful registration
        res.redirect('/');
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// Function to handle user login
async function loginUser(req, res) {
    try {
        // Extract user details from request body
        const { user_ID, password } = req.body;

        // Connect to MongoDB
        const client = new MongoClient(uri);
        await client.connect();
        const db = client.db('Sethdb'); // Change to your database name
        const users = db.collection('users'); // Create a collection named 'users'

        // Find the user in the database
        const user = await users.findOne({ user_ID });
        if (!user) {
            // User not found
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Hash the provided password and compare with the stored hashed password
        const hashedPassword = hashPassword(password);
        if (hashedPassword !== user.password) {
            // Incorrect password
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Set cookie
        res.cookie('authToken', user_ID, { httpOnly: true });

        // Redirect to homepage after successful login
        res.redirect('/');
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// Custom hashing function using SHA-256
function hashPassword(password) {
    const hash = crypto.createHash('sha256');
    hash.update(password);
    return hash.digest('hex');
}

module.exports = {
    renderRegisterForm,
    renderLoginForm,
    registerUser,
    loginUser
};
