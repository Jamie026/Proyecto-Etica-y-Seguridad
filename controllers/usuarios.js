const pool = require("./../config/db");
const { comparePassword, sendAuthEmail, createCookie, aes256Encrypt, aes256Decrypt } = require("./../config/authentication");

/**
 * Busca los mensajes enviados en la solicitud HTTP para continuar con el renderizado de la pagina de inicio para usuarios no logueados.
 * @param {Object} request - La solicitud HTTP que contiene los datos del usuario y las cookies.
 * @param {Object} response - La respuesta HTTP que se le enviara al cliente.
 */
function homePage(request, response) {
    const error = request.query.error || null; 
    const success = request.query.success || null;
    return response.render("main", { error, success });
}

/**
 * Renderiza la pagina de políticas de privacidad de la pagina.
 * @param {Object} request - La solicitud HTTP que contiene los datos del usuario y las cookies.
 * @param {Object} response - La respuesta HTTP que se le enviara al cliente.
 */
function politicy(request, response) {
    return response.render("politicy");
}

/**
 * Renderiza la pagina de logueo de los trabajadores.
 * @param {Object} request - La solicitud HTTP que contiene los datos del usuario y las cookies.
 * @param {Object} response - La respuesta HTTP que se le enviara al cliente.
 */
function loginGET(request, response) {
    const error = request.query.error || null; 
    return response.render("login", { error }); 
}

/**
 * Verifica si los datos ingresados por el usuario son validos para continuar con la MFA.
 * @param {Object} request - La solicitud HTTP que contiene los datos del usuario y las cookies.
 * @param {Object} response - La respuesta HTTP que se le enviara al cliente.
 */
async function loginUsuarioPOST(request, response) {
    const { usuario, clave } = request.body;
    try {
        const results = await pool.query("SELECT * FROM usuarios WHERE usuario = ? AND permiso = 1", [usuario]);
        if (results[0].length === 0)
            return response.redirect("/login?error=Credenciales incorrectas o no tiene permiso para acceder.");
        const userData = results[0][0];
        if (!comparePassword(clave, userData.clave)) 
            return response.redirect("/login?error=Credenciales incorrectas o no tiene permiso para acceder.");
        const token = await sendAuthEmail(userData.email, response);
        if (!token)
            return response.redirect("/login?error=Error al enviar correo de autenticación.");
        request.session.token = aes256Encrypt(JSON.stringify(token));
        request.session.userData = aes256Encrypt(JSON.stringify(userData));
        return response.render("check");
    } catch (error) {
        return response.redirect("/login?error=Error al iniciar sesión.");
    }
}

/**
 * Verifica el token del MFA para continuar con la renderización del dashboard.
 * @param {Object} request - La solicitud HTTP que contiene los datos del usuario y las cookies.
 * @param {Object} response - La respuesta HTTP que se le enviara al cliente.
 */
function authenticationUsuario(request, response) {
    const userToken = request.body.codigo_mfa;
    const tokenDesencriptada = aes256Decrypt(request.session.token);
    if (userToken == tokenDesencriptada){
        const userData = JSON.parse(aes256Decrypt(request.session.userData));        
        createCookie(userData.usuario, response);
        return response.redirect("/dashboard");
    }
    else
        return response.redirect("/login?error=Error de autenticación.");
}

/**
 * Elimina la cuenta de un trabajador por medio del enlance enviado a su correo.
 * @param {Object} request - La solicitud HTTP que contiene los datos del usuario y las cookies.
 * @param {Object} response - La respuesta HTTP que se le enviara al cliente.
 */
async function deleteByEmail(request, response) {
    try{
        const usuarioDesencriptado = aes256Decrypt(request.params.id);
        const [results] = await pool.query("DELETE FROM usuarios WHERE usuario = ?", [usuarioDesencriptado]);
        if (results.affectedRows > 0)
            return response.redirect("/?success=Cuenta eliminada.");
        else
            return response.redirect("/?error=Usuario no encontrado.");
    } catch (error) {
        return response.redirect("/?error=Error al eliminar la cuenta.");
    }
}

module.exports = {
    homePage,
    politicy,
    loginGET,
    loginUsuarioPOST,
    authenticationUsuario,
    deleteByEmail
};