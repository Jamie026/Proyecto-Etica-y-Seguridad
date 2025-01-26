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

/**
 * Middleware que verifica que el usuario no este logueado.
 * @param {Object} request - La solicitud HTTP que contiene los datos del usuario y las cookies.
 * @param {Object} response - La respuesta HTTP que se le enviara al cliente.
 * @param {function} next - El siguiente middleware a ejecutar.
 * @returns Ejecuta la funcion next en caso de que el usuario no este logeado, caso contrario lo manda al dashboard.
 */
async function onlyPublic(request, response, next) {
    const logued = await checkCookie(request);
    return (!logued) ? next() : response.redirect("/dashboard");
}

/**
 * Middleware que verifica que el usuario este logueado.
 * @param {Object} request - La solicitud HTTP que contiene los datos del usuario y las cookies.
 * @param {Object} response - La respuesta HTTP que se le enviara al cliente.
 * @param {function} next - El siguiente middleware a ejecutar.
 * @returns Ejecuta la funcion next en caso de que el usuario este logeado, caso contrario lo manda al inicio.
 */
async function onlyLogged(request, response, next) {
    const logued = await checkCookie(request);
    return (logued) ? next() : response.redirect("/");
}

/**
 * Middleware que verifica si el usuario logueado tiene permisos de administrador.
 * @param {Object} request - La solicitud HTTP que contiene los datos del usuario y las cookies.
 * @param {Object} response - La respuesta HTTP que se le enviara al cliente.
 * @param {function} next - El siguiente middleware a ejecutar.
 * @returns Ejecuta la funcion next en caso de que el usuario tenga los permisos, caso contrario lo manda al dashboard con un mensaje de error.
 */
async function onlyAdmin(request, response, next) {
    const workerData = JSON.parse(aes256Decrypt(request.session.user));
    return (workerData.administrador == 1) ? next() : response.redirect("/dashboard?error=No tiene autorización para esta sección");
}

/**
 * Verifica todos los campos del formulario de registro de trabajador.
 * @param {Object} request - La solicitud HTTP que contiene los datos del usuario y las cookies.
 * @param {Object} response - La respuesta HTTP que se le enviara al cliente.
 * @param {function} next - El siguiente middleware a ejecutar.
 * @returns Ejecuta la funcion next en caso de que todo este correcto, en caso contrario manda un error.
 */
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

/**
 * Verifica todos los campos del formulario de logueo de trabajador.
 * @param {Object} request - La solicitud HTTP que contiene los datos del usuario y las cookies.
 * @param {Object} response - La respuesta HTTP que se le enviara al cliente.
 * @param {function} next - El siguiente middleware a ejecutar.
 * @returns Ejecuta la funcion next en caso de que todo este correcto, en caso contrario lo manda a la pagina de logueo con un error.
 */
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