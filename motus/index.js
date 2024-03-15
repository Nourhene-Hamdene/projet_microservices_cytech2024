const express = require("express");
const app = express();
const port = process.env.PORT || 8080;
const os = require("os");
var fs = require("fs");
app.use(express.static("www"));
const sessions = require("express-session");
const jwt = require("jsonwebtoken");
var session;
const path = require("path");
app.use("/", express.static(path.join(__dirname, "www")));
require("dotenv").config();
const cors = require("cors");
app.use(cors());
const winston = require('winston');
const LokiTransport = require('winston-loki');

// Gestion of the token and middleware
function authenticateToken(req, res, next) {
  if (req.query.token) {
    jwt.verify(
      req.query.token,
      process.env.ACCESS_TOKEN_SECRET,
      (err, user) => {
        console.log(user);
        if (err) {
          return res.sendStatus(401);
        } else {
          session = req.session;
          console.log(session);
          if (session.userid) {
            next();
          } else {
            req.user = user;
            session.userid = user;
            next();
          }
        }
      }
    );
  } else {
    var redirectUri = req.protocol + "://" + req.get("host") + req.url;
    res
      .status(302)
      .redirect(
        "http://localhost:5000/authorize?client_id=" +
        process.env.CLIENT_ID +
        "&scope=motus_app&redirect_uri=" +
        redirectUri
      );
  }
}

// Use express session to control the authentication
const oneDay = 1000 * 60 * 60 * 24;
app.use(
  sessions({
    secret: process.env.SECRET_KEY,
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false,
  })
);

//Loki pour les logs
const loki_uri = process.env.LOKI || "http://127.0.0.1:3100";

const { createLogger, transports } = require("winston");
const options = {
  transports: [
    new LokiTransport({
      host: loki_uri,
    }),
  ],
};
const logger = createLogger(options);


// Array that contains all words
var array = fs
  .readFileSync(__dirname + "/data/liste_francais_utf8.txt")
  .toString()
  .split("\n");

function Verification_mot() {
  var fichier = fs.readFileSync(__dirname + "/data/mot.json");
  var mot = JSON.parse(fichier);
  var date_ob = new Date();
  // adjust 0 before single digit date
  var day = ("0" + date_ob.getDate()).slice(-2);
  // current month
  var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
  // current year
  var year = date_ob.getFullYear();
  var date_jour = day + "/" + month + "/" + year;
  if (date_jour !== mot.date) {
    mot.id = Math.floor(Math.random() * 22739);
    mot.date = date_jour;
    let donnees = JSON.stringify(mot);
    fs.writeFileSync(__dirname + "/data/mot.json", donnees);
  }
}

function get_mot() {
  var fichier = fs.readFileSync(__dirname + "/data/mot.json");
  var mot = JSON.parse(fichier);
  return mot;
}

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

app.get("/", authenticateToken, (req, res) => {
  Verification_mot();
  res.sendFile(__dirname + "/www/home.html");
});

app.get("/port", authenticateToken, (req, res) => {
  res.status(200).json({
    serveur: "Motus app working on : ",
    hostname: os.hostname(),
    port: port,
  });
});

app.get("/word", (req, res) => {
  if (req.query.id) {
    res.send(array[req.query.id]);
  } else {
    var mot = get_mot();
    res.send(array[mot.id]);
  }
});

//prometheus pour les metrics
const client = require('prom-client');
const defaultLabels = { serviceName: 'api-v1' };
const register = client.register
register.setDefaultLabels(defaultLabels);
client.collectDefaultMetrics({register});

app.get("/metrics",async (req,res)=> {
  try {
		res.set('Content-Type', register.contentType);
		res.end(await register.metrics());
	} catch (ex) {
		res.status(500).end(ex);
	}
})

app.get("/score", authenticateToken, (req, res) => {
  res.sendFile(__dirname + "/www/score.html");
});

// Error management
app.use((req, res, next) => {
  const error = new Error("Page not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});
