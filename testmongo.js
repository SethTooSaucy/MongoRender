const { MongoClient } = require("mongodb");
const express = require('express');
const app = express();
const port = 3000;
const uri = "mongodb+srv://lillaundry:Antib7iotics!@sethcluster.lbpora8.mongodb.net/?retryWrites=true&w=majority&appName=SethCluster";
const cookieParser = require('cookie-parser');
const crypto = require('crypto'); // Import the crypto module

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Default endpoint
app.get('/', (req, res) => {
  if (req.cookies.authToken) {
    res.send(`You are authenticated with token: ${req.cookies.authToken}`);
  } else {
    res.send(`
        <h2>Welcome to our site!</h2>
        <button onclick="window.location.href='/register'">Register</button>
        <button onclick="window.location.href='/login'">Login</button>
    `);
  }
});

// Register form
app.get('/register', (req, res) => {
  res.send(`
      <h2>Register</h2>
      <form method="post" action="/register">
          <input type="text" name="user_ID" placeholder="Username" required><br>
          <input type="password" name="password" placeholder="Password" required><br>
          <button type="submit">Register</button>
      </form>
  `);
});

app.get('/login', (req, res) => {
  res.send(`
      <h2>Login</h2>
      <form method="post" action="/login">
          <input type="text" name="user_ID" placeholder="Username" required><br>
          <input type="password" name="password" placeholder="Password" required><br>
          <button type="submit">Login</button>
      </form>
  `);
});

// Print all cookies endpoint
app.get('/cookies', (req, res) => {
    res.send(`Active Cookies: ${JSON.stringify(req.cookies)}<br><a href="/clear-cookie">Clear Cookie</a>`);
});

// Clear cookie endpoint
app.get('/clear-cookie', (req, res) => {
    res.clearCookie('authToken');
    res.send('Cookie cleared successfully!<br><a href="/">Return to home</a>');
});

app.post('/register', async (req, res) => {
  try {
    // Extract user details from request body
    const { user_ID, password } = req.body;

    // Hash the password using crypto module
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

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

    // Respond with success message
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/login', async (req, res) => {
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
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
    if (hashedPassword !== user.password) {
      // Incorrect password
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Close MongoDB connection
    await client.close();

    // Set cookie
    res.cookie('authToken', user_ID, { httpOnly: true });
    
    // Respond with success message and redirect to homepage
    res.status(200).json({ Congrats: 'Login successful' });
    res.redirect('/');
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


