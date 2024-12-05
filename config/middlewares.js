const { checkCookie, aes256Decrypt } = require("./authentication");
const { Validator } = require("node-input-validator");
const niv = require('node-input-validator');

niv.setLang("es");

niv.extendMessages({
    numeric: "El campo :attribute solo puede contener números.",
    required: "El campo :attribute es obligatorio.",
    regex: "El formato del campo :attribute no es válido.",
    alpha: "El campo :attribute solo puede contener letras y espacios.",
    length: "El campo :attribute debe tener mínimo 8 caracteres y máximo 20",
    email: "El campo :attribute debe tener formato de correo electrónico",
    alphaNumeric: "El campo :attribute solo puede contener letras y números."
}, "es");

niv.extend("alpha", ({ value }) => /^[A-Za-zñÑ\s]+$/.test(value), "El campo :attribute solo puede contener letras y espacios.");
niv.extend("alphaNumeric", ({ value }) => /^[A-Za-z0-9*]+$/.test(value), "El campo :attribute solo puede contener letras, números y asteriscos.");

async function onlyPublic(request, response, next) {
    const logued = await checkCookie(request);
    return (!logued) ? next() : response.redirect("/dashboard");
}

async function onlyLogged(request, response, next) {
    const logued = await checkCookie(request);
    return (logued) ? next() : response.redirect("/");
}

async function onlyAdmin(request, response, next) {
    const workerData = JSON.parse(aes256Decrypt(request.session.user));
    return (workerData.administrador == 1) ? next() : response.redirect("/dashboard?error=No tiene autorización para esta sección");
}

async function completeValidation(request, response, next) {
    const inputs = new Validator(request.body, {
        nombre: "required|alpha",
        apellido: "required|alpha",
        email: "required|email",
        usuario: "required|length:20,8|alphaNumeric",
        clave: "required|length:20,8|alphaNumeric"
    });

    const matched = await inputs.check();
    if (!matched) 
        return response.status(400).json({ message: inputs.errors });
    return next();
}

async function simpleValidation(request, response, next) {
    const inputs = new Validator(request.body, {
        usuario: "required|length:20,8|alphaNumeric",
        clave: "required|length:20,8|alphaNumeric"
    });

    const matched = await inputs.check();
    if (!matched) 
        return response.redirect("/login?error=Los datos no cumplen con el formato.");
    return next();
}

module.exports = {
    onlyPublic,
    onlyLogged,
    onlyAdmin,
    completeValidation,
    simpleValidation
};