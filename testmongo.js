const { MongoClient } = require("mongodb");
const express = require('express');
const app = express();
const port = 3000;
const uri = "mongodb+srv://lillaundry:Antib7iotics!@sethcluster.lbpora8.mongodb.net/?retryWrites=true&w=majority&appName=SethCluster";
const bcrypt = require('bcrypt');

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Default endpoint
app.get('/', (req, res) => {
  if (req.headers.cookie) {
    const authToken = req.headers.cookie.split('=')[1];
    res.send(`You are authenticated with token: ${authToken}`);
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
  if (req.headers.cookie) {
    res.send(`Active Cookies: ${JSON.stringify(req.headers.cookie)}<br><a href="/clear-cookie">Clear Cookie</a>`);
  } else {
    res.send('No active cookies found!');
  }
});

// Clear cookie endpoint
app.get('/clear-cookie', (req, res) => {
  if (req.headers.cookie) {
    res.clearCookie('authToken');
    res.send('Cookie cleared successfully!<br><a href="/">Return to home</a>');
  } else {
    res.send('No active cookies found!');
  }
});

app.post('/register', async (req, res) => {
  try {
    // Extract user details from request body
    const { user_ID, password } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

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

    // Check if the password is correct
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      // Incorrect password
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Close MongoDB connection
    await client.close();

    // Set cookie manually
    res.setHeader('Set-Cookie', `authToken=${user_ID}; HttpOnly`);
    
    // Respond with success message and redirect to homepage
    res.status(200).json({ Congrats: 'Login successful' });
    res.redirect('/');
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

