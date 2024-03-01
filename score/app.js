const express = require('express');
const redis = require('redis');
const bodyParser = require('body-parser');

const app = express();
const client = redis.createClient();

// Middleware to parse JSON body
app.use(bodyParser.json());

// Endpoint to set player score
app.post('/setscore', (req, res) => {
    const { playerId, score } = req.body;
    client.set(playerId, score, (err) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error setting score');
        } else {
            res.status(200).send('Score set successfully');
        }
    });
});

// Endpoint to get player score
app.get('/getscore', (req, res) => {
    const playerId = req.query.playerId;
    client.get(playerId, (err, score) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error getting score');
        } else if (score === null) {
            res.status(404).send('Player score not found');
        } else {
            res.status(200).json({ playerId, score });
        }
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
