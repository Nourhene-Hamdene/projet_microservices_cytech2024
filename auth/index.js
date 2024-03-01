const express = require('express');
const session = require('express-session');
const app = express();

// Configuration de express-session
app.use(session({
    secret: 'mysecretkey',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 24 * 60 * 60 * 1000
    }
}));

// Route pour afficher le contenu de la session
app.get('/session', (req, res) => {
    res.send(JSON.stringify(req.session));
});

// Démarrer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
