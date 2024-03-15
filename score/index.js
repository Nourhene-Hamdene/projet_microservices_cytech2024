const express = require("express");
const app = express();
const redis = require("redis");
const port = process.env.PORT || 4000;
const cors = require("cors");

// Configure Redis client
const redisClient = redis.createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379"
});
redisClient.connect();

app.use(cors({ origin: "http://localhost:8080", optionsSuccessStatus: 200 }));
app.use(express.static("www"));
app.use(express.json());

app.get("/update", async (req, res) => {
  if (req.query.username && req.query.score) {
    try {
      const { username, score } = req.query;
      const scoreKey = `score:${username}`;

      // Récupère le score actuel et incrémente le nombre de tentatives
      const currentScore = await redisClient.hGet(scoreKey, "score");
      const nbTentative = await redisClient.hIncrBy(scoreKey, "nbTentative", 1);
      const newScore = parseInt(score, 10) + (currentScore ? parseInt(currentScore, 10) : 0);

      // Met à jour le score et le nombre de tentatives
      await redisClient.hSet(scoreKey, "score", newScore.toString(), "nbTentative", nbTentative.toString());

      res.send('ok');
    } catch (error) {
      console.error(error);
      res.status(500).send('error');
    }
  } else {
    res.send('error');
  }
});

app.get("/score", async (req, res) => {
  if (req.query.username) {
    try {
      const scoreKey = `score:${req.query.username}`;
      const score = await redisClient.hGetAll(scoreKey);

      if (score) {
        res.json(score);
      } else {
        res.status(404).send('User score not found');
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('error');
    }
  } else {
    res.status(400).send('Username is required');
  }
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
