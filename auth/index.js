// const express = require('express');
// const app = express();
// const port = process.env.PORT || 3010;
// const path = require('path');
// const admin = require('firebase-admin');
// const bodyParser = require('body-parser'); 
// const store = require("store2");
// const jwt = require('jsonwebtoken'); 
// const fs = require('fs');

// // Initialisation de Firebase Admin SDK
// const serviceAccount = require('./microservicescytech2024-firebase-adminsdk-c2ubw-e2713152cf.json');
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: 'https://microservicescytech2024-default-rtdb.europe-west1.firebasedatabase.app/'
// });

// // Utilisation du middleware body-parser pour analyser les données de formulaire
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, '../motus/Vanilla Server')));
// app.use(express.static(path.join(__dirname, '../motus/Vanilla Server/www')));
// function verifyToken(req, res, next) {
//   const token = req.headers['authorization'];
//   if (!token) return res.status(401).json({ error: 'Token non fourni' });

//   jwt.verify(token, 'your-secret-key', (err, decoded) => {
//     if (err) return res.status(403).json({ error: 'Token non valide' });
//     req.user = decoded;
//     next();
//   });
// }

// // Étape 1 : Redirection si l'utilisateur n'est pas connecté
// app.use((req, res, next) => {
//   const isAuthenticated = true; // Implémentez votre logique d'authentification
//   if (!isAuthenticated) {
//     // Redirection si l'utilisateur n'est pas authentifié
//     const authentServerUrl = process.env.AUTHENT_OPENID || 'http://localhost:5000/authorize';
//     const redirectUrl = `${authentServerUrl}?clientid=yourClientId&scope=openid&redirect_uri=http://localhost:${port}/login`;
//     return res.redirect(redirectUrl);
//   }
//   next();
// });

// // Route pour afficher la page de formulaire d'inscription
// app.get('/register', (req, res) => {
//   res.sendFile(path.join(__dirname, 'register.html'));
// });

// // Route pour gérer les soumissions de formulaire d'inscription
// app.post("/register", (req, res) => {
//   const { email, password, confirmPassword } = req.body;

//   // Vérification si les mots de passe correspondent
//   if (password !== confirmPassword) {
//     res.status(400).json({ erreur: "Les mots de passe ne correspondent pas" });
//     return;
//   }

//   // Vérification si l'email est déjà utilisé
//   admin.auth().getUserByEmail(email)
//     .then((userRecord) => {
//       res.status(400).json({ erreur: "Cet email est déjà utilisé" });
//     })
//     .catch((error) => {
//       if (error.code === 'auth/user-not-found') {
//         // Email n'existe pas, alors nous pouvons créer un nouvel utilisateur
//         admin.auth().createUser({
//           email: email,
//           password: password
//         })
//         .then((userRecord) => {
//           console.log('Utilisateur créé avec succès :', userRecord.uid);
//           res.status(200).json({ message: "Utilisateur créé avec succès" });
//         })
//         .catch((error) => {
//           console.error('Erreur lors de la création de l\'utilisateur :', error);
//           res.status(500).json({ erreur: "Erreur lors de la création de l'utilisateur" });
//         });
//       } else {
//         console.error('Erreur lors de la vérification de l\'utilisateur existant :', error);
//         res.status(500).json({ erreur: "Erreur lors de la vérification de l'utilisateur existant" });
//       }
//     });
// });

// // Route pour servir le fichier index.html
// app.get('/motus/Vanilla%20Server/www/index.html', (req, res) => {
//   const indexPath = '/data/Documents/PFE/Microservices/projet_microservices_cytech2024/motus/Vanilla Server/www/index.html';
  
//   // Lecture du contenu du fichier index.html
//   fs.readFile(indexPath, 'utf8', (err, data) => {
//     if (err) {
//       console.error('Erreur lors de la lecture du fichier index.html :', err);
//       return res.status(500).send('Erreur lors de la lecture du fichier index.html');
//     }

//     // Envoi du contenu du fichier en réponse à la requête
//     res.send(data);
//   });
// });

// // Route pour afficher la page de connexion
// app.get('/login', (req, res) => {
//   res.sendFile(path.join(__dirname, 'login.html'));
// });

// // Étape 2 : Initiation du fournisseur OpenID
// app.get('/authorize', (req, res) => {
//   // Contrôle des paramètres OpenID requis
//   const { clientid, scope, redirect_uri } = req.query;
//   if (clientid && scope && redirect_uri) {
//     // Affichage du formulaire de connexion
//     res.sendFile(path.join(__dirname, 'login.html'));
//   } else {
//     res.status(400).json({ erreur: "Paramètres OpenID manquants" });
//   }
// });
// // // Route pour servir index.js
// // app.get('/motus/Vanilla%20Server/index.js', (req, res) => {
// //   res.sendFile(path.join(__dirname,  'index.js'));
// // });
// // Étape 1 : Redirection si l'utilisateur n'est pas connecté
// app.use((req, res, next) => {
//   const isAuthenticated = true; // Implémentez votre logique d'authentification
//   if (!isAuthenticated) {
//     // Redirection si l'utilisateur n'est pas authentifié
//     const authentServerUrl = process.env.AUTHENT_OPENID || 'http://localhost:5000/authorize';
//     const redirectUrl = `${authentServerUrl}?clientid=yourClientId&scope=openid&redirect_uri=http://localhost:${port}/login`;
//     return res.redirect(redirectUrl);
//   }
//   next();
// });

// // Étape 2 : Initiation du fournisseur OpenID
// app.get('/authorize', (req, res) => {
//   // Contrôle des paramètres OpenID requis
//   const { clientid, scope, redirect_uri } = req.query;
//   if (clientid && scope && redirect_uri) {
//     // Vérification des paramètres clientid, scope et redirect_uri
//     // Si tout est OK, affichez le formulaire de connexion
//     res.sendFile(path.join(__dirname, 'login.html'));
//   } else {
//     // Si des paramètres sont manquants, renvoyez une erreur
//     res.status(400).json({ erreur: "Paramètres OpenID manquants" });
//   }
// });

// // Route pour gérer les soumissions de formulaire de connexion
// app.post('/login', (req, res) => {
//   const email = req.body.email;
//   const password = req.body.password;

//   // Authentification de l'utilisateur avec Firebase Admin SDK
//   admin.auth().getUserByEmail(email)
//     .then((userRecord) => {
//       // Utilisateur trouvé, vérifiez le mot de passe (vous devrez implémenter cette logique)
//       // Générez un jeton d'authentification personnalisé pour cet utilisateur
//       const customToken = jwt.sign({ uid: userRecord.uid }, 'your-secret-key');
      
//       // Rediriger l'utilisateur vers sa page de jeu avec le token JWT comme paramètre d'URL
//       res.redirect(`/motus/Vanilla%20Server/www/index.html?token=${customToken}`);
//     })
//     .catch((error) => {
//       console.error('Erreur lors de la connexion de l\'utilisateur :', error);
//       res.status(500).send('Erreur lors de la connexion de l\'utilisateur');
//     });
// });

// // // Route pour gérer les soumissions de formulaire de connexion
// // app.post('/login', (req, res) => {
// //   const email = req.body.email;
// //   const password = req.body.password;

// //   // Authentification de l'utilisateur avec Firebase Admin SDK
// //   admin.auth().getUserByEmail(email)
// //     .then((userRecord) => {
// //       // Utilisateur trouvé, vérifiez le mot de passe (vous devrez implémenter cette logique)
// //       // Générez un jeton d'authentification personnalisé pour cet utilisateur
// //       const customToken = jwt.sign({ uid: userRecord.uid }, 'your-secret-key');
      
// //       // Rediriger l'utilisateur vers sa page de jeu avec le token JWT comme paramètre d'URL
// //       res.redirect(`/motus/Vanilla%20Server/www/index.html?token=${customToken}`);
// //     })
// //     .catch((error) => {
// //       console.error('Erreur lors de la connexion de l\'utilisateur :', error);
// //       res.status(500).send('Erreur lors de la connexion de l\'utilisateur');
// //     });
// // });

// app.use(express.static(path.join(__dirname, 'motus', 'Vanilla Server')));

// // Lancement du serveur
// app.listen(port, () => {
//   console.log(`Serveur en cours d'exécution sur le port ${port}`);
// });



//---------------------------------------
const express = require('express');
const app = express();
const port = process.env.PORT || 3010;
const path = require('path');
const admin = require('firebase-admin');
const bodyParser = require('body-parser'); 
const jwt = require('jsonwebtoken'); 
const fs = require('fs');

// Initialisation de Firebase Admin SDK
const serviceAccount = require('./microservicescytech2024-firebase-adminsdk-c2ubw-e2713152cf.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://microservicescytech2024-default-rtdb.europe-west1.firebasedatabase.app/'
});

// Utilisation du middleware body-parser pour analyser les données de formulaire
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware pour servir les fichiers statiques
app.use(express.static(path.join(__dirname, '../motus/Vanilla Server')));

// Middleware pour servir les fichiers HTML, CSS, JS, etc. dans le dossier www
app.use(express.static(path.join(__dirname, '../motus/Vanilla Server/www')));

// // Middleware pour vérifier le token JWT
// function verifyToken(req, res, next) {
//   const token = req.headers['authorization'];
//   if (!token) return res.status(401).json({ error: 'Token non fourni' });

//   jwt.verify(token, 'your-secret-key', (err, decoded) => {
//     if (err) return res.status(403).json({ error: 'Token non valide' });
//     req.user = decoded;
//     next();
//   });
// }

// Étape 1 : Redirection si l'utilisateur n'est pas connecté
app.use((req, res, next) => {
  const isAuthenticated = true; // Implémentez votre logique d'authentification
  if (!isAuthenticated) {
    // Redirection si l'utilisateur n'est pas authentifié
    const authentServerUrl = process.env.AUTHENT_OPENID || 'http://localhost:5000/authorize';
    const redirectUrl = `${authentServerUrl}?clientid=yourClientId&scope=openid&redirect_uri=http://localhost:${port}/login`;
    return res.redirect(redirectUrl);
  }
  next();
});

app.get("/token",(req,res)=>{
  res.redirect('/red')
})

// Route pour afficher la page de formulaire d'inscription
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'register.html'));
});

// Route pour gérer les soumissions de formulaire d'inscription
app.post("/register", (req, res) => {
  const { email, password, confirmPassword } = req.body;

  // Vérification si les mots de passe correspondent
  if (password !== confirmPassword) {
    res.status(400).json({ erreur: "Les mots de passe ne correspondent pas" });
    return;
  }

  // Vérification si l'email est déjà utilisé
  admin.auth().getUserByEmail(email)
    .then((userRecord) => {
      res.status(400).json({ erreur: "Cet email est déjà utilisé" });
    })
    .catch((error) => {
      if (error.code === 'auth/user-not-found') {
        // Email n'existe pas, alors nous pouvons créer un nouvel utilisateur
        admin.auth().createUser({
          email: email,
          password: password
        })
        .then((userRecord) => {
          console.log('Utilisateur créé avec succès :', userRecord.uid);
          res.status(200).json({ message: "Utilisateur créé avec succès" });
        })
        .catch((error) => {
          console.error('Erreur lors de la création de l\'utilisateur :', error);
          res.status(500).json({ erreur: "Erreur lors de la création de l'utilisateur" });
        });
      } else {
        console.error('Erreur lors de la vérification de l\'utilisateur existant :', error);
        res.status(500).json({ erreur: "Erreur lors de la vérification de l'utilisateur existant" });
      }
    });
});

// Route pour afficher la page de connexion
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});





// Route pour gérer les soumissions de formulaire de connexion
app.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  // Authentification de l'utilisateur avec Firebase Admin SDK
  admin.auth().getUserByEmail(email)
    .then((userRecord) => {
      const uid = userRecord.uid;

      // Vérification du mot de passe fourni avec Firebase Authentication
      admin.auth().verifyPassword(uid, password)
        .then(() => {
          const customToken = jwt.sign({ uid: uid }, 'your-secret-key');
          res.redirect(`/token?token=${customToken}`);
        })
        .catch((error) => {
          console.error('Erreur lors de la vérification du mot de passe :', error);
          res.status(403).send('Erreur lors de la vérification du mot de passe');
        });
    })
    .catch((error) => {
      if (error.code === 'auth/user-not-found') {
        // L'utilisateur n'a pas été trouvé
        res.status(404).send('Utilisateur non trouvé');
      } else {
        // Une autre erreur s'est produite lors de la recherche de l'utilisateur
        console.error('Erreur lors de la recherche de l\'utilisateur :', error);
        res.status(500).send('Erreur lors de la recherche de l\'utilisateur');
      }
    });
});
// Route pour gérer la réponse de l'authentification et rediriger vers la page de jeu avec le token JWT
app.get('/token', (req, res) => {
  // Récupérer le token JWT de la requête
  const token = req.query.token;

  // Vérifier si le token JWT est présent
  if (!token) {
    return res.status(400).json({ erreur: 'Token JWT manquant dans la requête' });
  }

  // Rediriger l'utilisateur vers la page de jeu avec le token JWT comme paramètre d'URL
res.redirect(`http://localhost:3000/?token=${token}`);
});
// Route pour servir le fichier index.js
app.get('/index.js', (req, res) => {
  res.sendFile(path.join(__dirname, '../motus/Vanilla Server/www/index.js'));
});

// Lancement du serveur
app.listen(port, () => {
  console.log(`Serveur en cours d'exécution sur le port ${port}`);
});
