const ms = require("ms");
const pool = require("./db");
const bcrypt = require("bcrypt");
const aes256 = require("aes256");
const nodemailer = require("nodemailer");
const jsonwebtoken = require("jsonwebtoken");
require("dotenv").config();

function aes256Encrypt(data) {
    const key = process.env.AES_256;
    return aes256.encrypt(key, data);
}

function aes256Decrypt(encryptedData) {
    const key = process.env.AES_256;
    return aes256.decrypt(key, encryptedData);
}

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_SENDER,
        pass: process.env.EMAIL_SENDER_PASSWORD
    }
});

function encryptPassword(password) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    return hash;
}

function comparePassword(password, hashedPassword) {
    return bcrypt.compareSync(password, hashedPassword);
}

async function sendAuthEmail(email, response) {
    try {
        const token = Math.floor(1000 + Math.random() * 9000);
        const html = await new Promise((resolve, reject) => {
            response.render("codeMFA", { token }, (err, renderedHtml) => {
                err ? reject(err) : resolve(renderedHtml);
            });
        });
        const mailOptions = {
            from: "Proyecto Ética y Seguridad",
            to: email,
            subject: "Código de verificación para tu cuenta",
            html
        };

        await transporter.sendMail(mailOptions);
        return token;
    } catch (error) {
        console.error("Error al generar token", error);
        return null;
    }
}

async function sendConfirmationEmail(email, username, password, deleteAccountLink, response) {
    try {
        const html = await new Promise((resolve, reject) => {
            response.render("confirmation", { username, password, deleteAccountLink }, (err, renderedHtml) => {
                err ? reject(err) : resolve(renderedHtml);
            });
        });
        const mailOptions = {
            from: "Proyecto de Ética y Seguridad",
            to: email,
            subject: "Notificación sobre el uso de tus datos y acceso a la plataforma",
            html
        };

        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error("Error al enviar correo de confirmación: ", error);
        return false;
    }
}

function createToken(data) {
    return jsonwebtoken.sign(
        { data: data }, 
        process.env.TOKEN_PRIVATE_KEY,
        { expiresIn: process.env.TOKEN_EXPIRATION } 
    );
}

function createCookie(usuario, response) {
    const token = createToken(usuario);
    const cookieOptions = {
        expires: new Date(Date.now() + ms(process.env.TOKEN_EXPIRATION)), 
        path: "/",              
        httpOnly: true,         
        secure: true,
        sameSite: "strict"
    };
    response.cookie("tokenKey", token, cookieOptions);
}

async function checkCookie(request) {
    try {
        const cookieJWT = request.headers.cookie.split("; ").find(cookie => cookie.startsWith("tokenKey=")).slice(9); 
        const decodificada = jsonwebtoken.verify(cookieJWT, process.env.TOKEN_PRIVATE_KEY);
        const [results] = await pool.query("SELECT * FROM usuarios WHERE usuario = ? AND permiso = 1", [decodificada.data]);

        if (results.length > 0) {
            request.session.user = aes256Encrypt(JSON.stringify(results[0]));
            return true;
        }
        return false;
    } catch (error) {
        return false;
    }
}

module.exports = {
    encryptPassword,
    comparePassword,
    sendAuthEmail,
    sendConfirmationEmail,
    createCookie,
    checkCookie,
    aes256Encrypt,
    aes256Decrypt
};