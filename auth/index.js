// Import required modules
const express = require('express');
const session = require('express-session');
const crypto = require('crypto');

// Create an Express app
const app = express();

// Add session middleware
app.use(session({
  secret: 'secret_key', // Change this to a secure secret
  resave: false,
  saveUninitialized: true
}));

// Middleware to check if user is logged in
const requireLogin = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/login.html');
  }
};

// Apply middleware to all routes except login and register
app.use((req, res, next) => {
  if (req.path !== '/login.html' && req.path !== '/register.html') {
    requireLogin(req, res, next);
  } else {
    next();
  }
});

// Route to serve login.html
app.get('/login.html', (req, res) => {
  res.sendFile(__dirname + '/login.html');
});

// Route to serve register.html
app.get('/register.html', (req, res) => {
  res.sendFile(__dirname + '/register.html');
});

// Route to handle login
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  // Verify login credentials (pseudo code)
  if (isValidCredentials(username, password)) {
    req.session.user = username; // Save username in session
    res.redirect('/main.html'); // Redirect to main page
  } else {
    res.status(401).send('Invalid username or password');
  }
});

// Route to handle registration
app.post('/register', (req, res) => {
  const { username, password, confirmPassword } = req.body;
  // Check if username already exists (pseudo code)
  if (usernameExists(username)) {
    res.status(400).send('Username already exists');
  } else if (password !== confirmPassword) {
    res.status(400).send('Passwords do not match');
  } else {
    // Add user to database or storage
    addUser(username, hashPassword(password)); // Assuming hashPassword function is defined
    res.redirect('/login.html');
  }
});

// Function to hash password
const hashPassword = (password) => {
  return crypto.createHash('sha256').update(password).digest('hex');
};

// Function to verify login credentials (pseudo code)
const isValidCredentials = (username, password) => {
  // Implement logic to verify credentials (e.g., check against database)
  // Return true if valid, false otherwise
};

// Function to check if username already exists (pseudo code)
const usernameExists = (username) => {
  // Implement logic to check if username already exists in database
  // Return true if exists, false otherwise
};

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
