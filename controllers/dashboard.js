const { encryptPassword, sendConfirmationEmail, createCookie, aes256Encrypt, aes256Decrypt } = require("./../config/authentication");
const pool = require("./../config/db");

function homePage(request, response) {
    const error = request.query.error || null; 
    return response.render("dashboard", { error });
}

async function customers(request, response) {
    return response.render("customers");
}

async function customersFilter(request, response) {
    const { surname, clave } = request.body;
    const selectSql = clave ? "SELECT decrypt_customer_data(?, ?) AS result" : "SELECT estandar_customer_data(?) AS result";    
    try {
        const results = await pool.query(selectSql, clave ? [clave, surname] : [surname]);
        const customers = JSON.parse(results[0][0].result);
        if (!customers)
            return response.render("customers", { error: "No se encontraron resultados." });
        else
            return response.render("customers", { customers });
    } catch (error) {
        console.error("Error al filtrar los clientes: ", error.stack);
        return response.render("customers", { error: "Error al cargar los datos." });
    }
}

function workers(request, response){
    const error = request.query.error || null; 
    const success = request.query.success || null;
    return response.render("workers", { error, success });    
}

async function registerWorker(request, response) {
    const { nombre, apellido, clave, usuario, email } = request.body;  
    let encriptada = encryptPassword(clave);
    try {
        await pool.query("INSERT INTO usuarios (nombre, apellido, email, usuario, clave) VALUES (?, ?, ?, ?, ?)", 
            [nombre, apellido, email, usuario, encriptada]);
        const eliminarURL = "https://localhost:3000/deleteByEmail/" + encodeURIComponent(aes256Encrypt(usuario));
        const confirmationEmail = await sendConfirmationEmail(email, usuario, clave, eliminarURL, response);
        if (!confirmationEmail)
            return response.status(500).json({ message: [{ message: "Error al enviar correo de confirmación." }] });
        return response.status(201).json({ message: "Registro exitoso." });
    } catch (error) {        
        console.error("Error al registrar el usuario: ", error);
        if (error.message.includes("USUARIO_UNICO"))
            return response.status(500).json({ message: [{ message: "Error al registrar el nombre de usuario." }] });
        else if (error.message.includes("EMAIL_UNICO"))
           return response.status(500).json({ message: [{ message: "Error al registrar el email." }] });
        return response.status(500).json({ message: [{ message: "Error al procesar la solicitud." }] });
    }
}

async function updateAcceso(request, response) {
    try{
        const usuarioId = request.params.id;
        const value = request.params.value;
        const [results] = await pool.query("UPDATE usuarios SET permiso = ? WHERE idusuarios =?", [value, usuarioId]);
        if (results.affectedRows > 0)
            return response.redirect("/dashboard/workers?success=Modificación realizada.");
        else
            return response.redirect("/dashboard/workers?error=Usuario no encontrado.");
    } catch (error) {
        return response.redirect("/dashboard/workers?error=Error al modificar el atributo.");
    }
}

async function updateAdministrador(request, response) {
    try{
        const usuarioId = request.params.id;
        const value = request.params.value;
        const [results] = await pool.query("UPDATE usuarios SET administrador = ? WHERE idusuarios =?", [value, usuarioId]);
        if (results.affectedRows > 0)
            return response.redirect("/dashboard/workers?success=Modificación realizada.");
        else
            return response.redirect("/dashboard/workers?error=Usuario no encontrado.");
    } catch (error) {
        return response.redirect("/dashboard/workers?error=Error al modificar el atributo.");
    }
}

async function workersFilter(request, response) {
    const { nombre, apellido } = request.body;
    try {
        const results = await pool.query("SELECT * FROM usuarios WHERE nombre LIKE CONCAT('%', ?, '%') AND apellido LIKE CONCAT('%', ?, '%') ORDER BY nombre, apellido", [nombre, apellido]);
        const workers = results[0];
        if (workers.length <= 0)
            return response.render("workers", { error: "No se encontraron resultados." });
        return response.render("workers", { workers });
    } catch (error) {        
        console.error("Error al cargar los trabajadores: ", error.stack);
        return response.render("workers", { error: "Error al cargar los datos." });   
    }
};

async function profile(request, response) {
    const workerData = JSON.parse(aes256Decrypt(request.session.user));
    return response.render("profile", { workerData, error: workerData ? null : "Error al cargar los datos." });
}

async function deleteWorker(request, response) {
    try {
        const workerData = JSON.parse(aes256Decrypt(request.session.user));
        const [results] = await pool.query("DELETE FROM usuarios WHERE usuario = ?", [workerData.usuario]);
        if (results.affectedRows > 0) {
            response.cookie("tokenKey", "", { expires: new Date(0), path: "/" });
            request.session.destroy();
            return response.status(200).json({ message: "Cuenta eliminada." });
        }
        return response.status(404).json({ message: "Usuario no encontrado." });
    } catch (error) {
        console.error("Error eliminando usuario: ", error);
        return response.status(500).json({ message: "Error al procesar la solicitud." });
    }
}

async function changePrivacity(request, response) {
    try {
        const workerData = JSON.parse(aes256Decrypt(request.session.user));
        const value = workerData.usuarioVisible == 1 ? 0 : 1;
        const textContent = workerData.usuarioVisible == 1 ? "Mostrar mi usuario a otros trabajadores" : "Ocultar mi usuario de otros trabajadores";
        const [results] = await pool.query("UPDATE usuarios SET usuarioVisible = ? WHERE usuario =?", [value, workerData.usuario]);
        if (results.affectedRows <= 0)
            return response.status(404).json({ message: "Usuario no encontrado." });
        workerData.usuarioVisible = value;
        request.session.user = aes256Encrypt(JSON.stringify(workerData));
        return response.status(200).json({ message: "Configuración actualizada.", textContent });
    } catch (error) {
        console.error("Error cambiando la configuración de visibilidad: ", error);
        return response.status(500).json({ message: "Error al procesar la solicitud." });
    }
}

async function updateWorker(request, response) {
    const { nombre, apellido, clave, usuario, email } = request.body;
    try {
        const workerData = JSON.parse(aes256Decrypt(request.session.user));
        let encriptada = (/^[*]+$/.test(clave)) ? workerData.clave : encrypt(clave);
        const [results] = await pool.query("UPDATE usuarios SET usuario = ?, clave = ?, email = ?, nombre = ?, apellido = ? WHERE usuario = ?", [usuario, encriptada, email, nombre, apellido, workerData.usuario]);
        if (results.affectedRows <= 0)
            return response.status(404).json({ message: "Usuario no encontrado." });
        createCookie(usuario, response);
        return response.status(200).json({ message: "Datos actualizados." });        
    } catch (error) {
        console.error("Error actualizando los datos del usuario: ", error);
        return response.status(500).json({ message: "Error al procesar la solicitud." });
    }
}

function logout(request, response) {
    request.session.destroy((error) => {
        if (error) 
            return response.redirect("/dashboard?error=Error al procesar la solicitud.");
        response.cookie("tokenKey", "", { expires: new Date(0), path: "/" });
        return response.redirect("/");
    });
}

module.exports = {
    homePage,
    customers,
    customersFilter,
    workers,
    registerWorker,
    updateAcceso,
    updateAdministrador,
    workersFilter,
    profile,
    deleteWorker,
    changePrivacity,
    updateWorker,
    logout
};