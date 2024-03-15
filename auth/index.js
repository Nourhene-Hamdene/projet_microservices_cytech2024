const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cookieParser = require("cookie-parser");
const path = require("path");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const cors = require("cors");
const redis = require("redis");
const bcrypt = require('bcrypt');

// Configure Redis client
const redisClient = redis.createClient({
  url: 'redis://localhost:6379' 
});
redisClient.connect();

redisClient.on('error', (err) => console.log('Redis Client Error', err));

app.use(cors());
app.use("/", express.static(path.join(__dirname, "www")));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1800s",
  });
}

app.get("/authorize", (req, res) => {
  res.sendFile(path.join(__dirname, "www/login.html"));
});

app.post("/authorize", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Correction : Utiliser une clé structurée pour Redis
    const userKey = `user:${username}`;
    const userData = await redisClient.hGetAll(userKey);
    
    if (Object.keys(userData).length === 0) {
      return res.status(401).send("Invalid username or password");
    }

    const match = await bcrypt.compare(password, userData.password);
    if (match) {
      const access_token = generateAccessToken({ username });
      // Assurez-vous que redirect_uri est correctement géré sur le client
      res.status(302).redirect(`${req.query.redirect_uri}?token=${access_token}`);
    } else {
      res.status(401).send("Invalid username or password");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "www/register.html"));
});

app.post("/register", async (req, res) => {
  try {
    const { username, password, password2, firstname, lastname } = req.body;
    if (password !== password2) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    const userKey = `user:${username}`;
    const userExists = await redisClient.exists(userKey);

    if (userExists) {
      return res.status(409).json({ error: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await redisClient.hSet(userKey, {
      firstname,
      lastname,
      password: hashedPassword,
    });

    console.log(`User ${username} registered successfully.`);
    var urlconnexion = `${req.protocol}://${req.get("host")}/authorize?client_id=${req.query["client_id"]}&scope=${req.query["scope"]}&redirect_uri=${req.query["redirect_uri"]}`;
    res.status(201).json({
      message: "Registration successful. You can now log in.",
      loginUrl: urlconnexion,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
