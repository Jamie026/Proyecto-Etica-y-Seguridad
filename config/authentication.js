const ms = require("ms");
const pool = require("./db");
const bcrypt = require("bcrypt");
const aes256 = require("aes256");
const nodemailer = require("nodemailer");
const jsonwebtoken = require("jsonwebtoken");
require("dotenv").config();

/**
 * Retorna una cadena de texto encriptada con AES256.
 * @param {String} data - Cadena de texto a encriptar.
 * @returns Cadena de texto encriptada.
 */
function aes256Encrypt(data) {
    const key = process.env.AES_256;
    return aes256.encrypt(key, data);
}

/**
 * Retorna una cadena de texto desencriptada con AES256 y con la llave publica.
 * @param {String} encryptedData -Cadena de texto encriptada con AES256.
 * @returns Cadena de texto desencriptada.
 */
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

/**
 * Encripta una contraseña utilizando bcrypt para almacenarla de manera segura en la base de datos.
 * @param {string} password - La contraseña que se desea encriptar.
 * @returns Contraseña encriptada.
 */
function encryptPassword(password) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    return hash;
}

/**
 * Compara la contraseña ingresada por el usuario con la hasheada
 * @param {String} password - Contraseña ingresada por el usuario. 
 * @param {String} hashedPassword - Contraseña correcta hasheada.
 * @returns True si la contraseña es correcta, false caso contrario
 */
function comparePassword(password, hashedPassword) {
    return bcrypt.compareSync(password, hashedPassword);
}

/**
 * Envia un correo electrónico de autenticación al usuario con un código de verificación.
 * @param {string} email - El correo electrónico del usuario al que se enviará el código.
 * @param {object} response - La respuesta HTTP que se utilizará para renderizar la plantilla de correo electrónico.
 * @returns El token enviado al usuario en caso de que el correo se haya enviado correctamente, caso contrario  retorna null.
 */
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

/**
 * Envia un correo electrónico de confirmación al usuario con información sobre el uso de sus datos y acceso a la plataforma.
 * @param {string} email - El correo electrónico del usuario al que se enviará el correo de confirmación.
 * @param {string} username - El nombre de usuario del usuario.
 * @param {string} password - La contraseña del usuario.
 * @param {string} deleteAccountLink - El enlace para eliminar la cuenta del usuario.
 * @param {object} response - La respuesta HTTP que se utilizará para renderizar la plantilla de correo electrónico.
 * @returns True si el correo se envía correctamente, de lo contrario, resuelve a false.
 */
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

/**
 * Crea un JSON Web Token con proposito de autenticación.
 * @param {*} data - Algun dato del usuario que se quiera utilizar para crear el token.
 * @returns El token generado con el dato dado.
 */
function createToken(data) {
    return jsonwebtoken.sign(
        { data: data }, 
        process.env.TOKEN_PRIVATE_KEY,
        { expiresIn: process.env.TOKEN_EXPIRATION } 
    );
}

/**
 * Crea una Cookie con un JSON Web Token con proposito de autenticación.
 * @param {String} usuario - Dato del usuario para crear el JWT, el nombre usuario en este caso.
 * @param {Object} response - La respuesta HTTP en la que se almacenara la cookie.
 */
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

/**
 * Verifica si hay una cookie de autenticación válida en la solicitud.
 * @param {Object} request - La solicitud HTTP que contiene la cookie de autenticación.
 * @returns True en caso de que la cookie sea exista y sea válida, false en caso contrario.
 */
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