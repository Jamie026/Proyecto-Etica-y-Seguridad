/**
 * Procesa el formulario para registrar un trabajador.
 */
export function registerWorker() {        
    sendForm((result) => alertify.success("Trabajador registrado correctamente"), 
    (error) => {
        console.error("Error al enviar el formulario: ", error);    
        const result = error.response.data;            
        const messages = Object.values(result.message).map(error => error.message);            
        messages.forEach(msg => alertify.notify(msg, "error", 5));
    }, "register");
}

/**
 * Procesa el formulario para actualizar la información registrada de un trabajador.
 */
export function updateWorker() {
    sendForm((result) => window.location.reload(), 
    (error) => {
        console.error("Error al enviar el formulario: ", error);
        const result = error.response.data;            
        const messages = Object.values(result.message).map(error => error.message);            
        messages.forEach(msg => alertify.notify(msg, "error", 5));
    }, "updateWorker");
}

/**
 *  Extrae la información del formulario y la manda al servidor.
 * @param {function} successCallback - Función a ejecutar en caso de éxito.
 * @param {function} errorCallback - Función a ejecutar en caso de error.
 * @param {object} element - ID del formulario HTML.
 */
function sendForm(successCallback, errorCallback, element) {
    document.getElementById(element).addEventListener("submit", async (e) => {
        e.preventDefault();
        const formData = Object.fromEntries(new FormData(e.target).entries());
        try {
            alertify.warning("Enviando formulario...");
            const result = await axios.post(e.target.action, formData);  
            successCallback(result);          
        } catch (error) {
            errorCallback(error);
        }
    });
}