const express = require("express");
const app = express();
const ms = require("ms");
const fs = require("fs");
const path = require("path");
const https = require('https');
const handlebars = require("express-handlebars");
const session = require("express-session");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const port = 3000;

app.set("view engine", "hbs");
app.set("views", [__dirname + "/views", __dirname + "/views/emails"]);

app.use(session({
    secret: process.env.SESSION_KEY,
    resave: false, 
    saveUninitialized: true, 
    cookie: { 
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge:  ms(process.env.SESSION_EXPIRATION)
    } 
}));

app.engine("hbs", handlebars.engine({
    defaultLayout: "index",
    layoutsDir: __dirname + "/views/layouts", 
    extname: "hbs",
    partialsDir: __dirname + "/views/partials/",
    helpers: require("./config/handlebars-helpers")
}));

app.use(express.static(path.join(__dirname, "public")));

const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

const router = require("./routes/index.js");
const dashboard = require("./routes/dashboard.js");
const storage = require("./routes/storage.js");

app.use("/", router);
app.use("/dashboard", dashboard);
app.use("/storage", storage);

// Leer certificados SSL
const key = fs.readFileSync("./SSL/key.pem");
const cert = fs.readFileSync("./SSL/cert.pem");

// Crear servidor HTTPS
const server = https.createServer({ key: key, cert: cert }, app);

// Escuchar en HTTPS
server.listen(port, () => {
    console.log(`Service listening on https://localhost:${port}`);
});