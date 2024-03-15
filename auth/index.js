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

// Les routes restent les mêmes, mais la logique de stockage change

app.get("/authorize", (req, res) => {
  res.sendFile(path.join(__dirname, "www/login.html"));
});

app.post("/authorize", async (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;

    // Récupérer l'utilisateur de Redis
    const user = await redisClient.hGetAll(username);
    if (Object.keys(user).length !== 0 && user.password === password) {
      const access_token = generateAccessToken({ username: username });
      console.log(access_token);
      console.log(req.query.redirect_uri);
      res.status(302).redirect(req.query.redirect_uri + "?token=" + access_token);
    } else {
      res.send("Invalid username or password");
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
    const username = req.body.username;
    const userExists = await redisClient.exists(username);

    if (userExists) {
      res.status(409).json({ error: "Username already exists" });
      return;
    }

    if (req.body.password !== req.body.password2) {
      res.status(400).json({ error: "Passwords do not match" });
      return;
    }

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    await redisClient.hSet(username, {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
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
