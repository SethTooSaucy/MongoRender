// testmongo.js

const express = require('express');
const { MongoClient } = require("mongodb");
const app = express();
const path = require('path'); // Add this line
const port = 3000;

// Import routes
const authRoutes = require('./routes/authRoutes.js');
const topicsRoutes = require('./routes/topicsRoutes.js');

// MongoDB URI
const uri = "mongodb+srv://lillaundry:Antib7iotics!@sethcluster.lbpora8.mongodb.net/?retryWrites=true&w=majority&appName=SethCluster";

// Database connection
const client = new MongoClient(uri);

// Connect to MongoDB
async function connectToDatabase() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}

// Parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Parse cookies from request headers
app.use((req, res, next) => {
  if (req.headers.cookie) {
    const rawCookies = req.headers.cookie.split('; ');
    const cookies = {};
    rawCookies.forEach(rawCookie => {
      const parsedCookie = rawCookie.split('=');
      cookies[parsedCookie[0]] = parsedCookie[1];
    });
    req.cookies = cookies;
  } else {
    req.cookies = {}; // Set an empty object if no cookies are present
  }
  next();
});

// Use authentication routes
app.use(authRoutes);
app.use(topicsRoutes);
app.set('view engine', 'ejs');

// Default endpoint
app.get('/', (req, res) => {
    const authToken = req.cookies.authToken;
    const content = `
        You are authenticated as: ${authToken || 'Guest'} <br> 
        <button onclick="window.location.href='/topics'">View Topics</button>
        <button onclick="window.location.href='/register'">Register</button>
        <button onclick="window.location.href='/login'">Login</button>
    `;
    res.send(content);
});

// Start the server
async function startServer() {
    await connectToDatabase();
    app.listen(port, () => {
        console.log(`Server started at http://localhost:${port}`);
    });
}

startServer();

