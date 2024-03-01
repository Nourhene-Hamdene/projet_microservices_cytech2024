const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();

// Configuration de express-session
app.use(session({
    secret: 'mysecretkey',
    resave: false,
    saveUninitialized: false
}));

// Middleware pour parser les données du formulaire
app.use(bodyParser.urlencoded({ extended: true }));

// Route pour afficher le formulaire de connexion
app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/login.html');
});

// Route pour gérer la soumission du formulaire de connexion
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Vérifier les identifiants (exemple : vérification avec des données en dur)
    if (username === 'admin' && password === 'password') {
        req.session.user = username; // Enregistrer l'utilisateur dans la session
        res.redirect('/game'); // Rediriger vers la page principale du jeu
    } else {
        res.send('Identifiants incorrects'); // Afficher un message d'erreur
    }
});

// Middleware pour vérifier si l'utilisateur est connecté
app.use((req, res, next) => {
    if (req.session.user) {
        next(); // Continuer vers la prochaine middleware
    } else {
        res.redirect('/login'); // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
    }
});

// Route pour afficher la page principale du jeu
app.get('/game', (req, res) => {
    res.send('Bienvenue sur la page principale du jeu');
});

// Démarrer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
