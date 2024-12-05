export function registrarUsuario() {        
    sendForm((result) => alertify.success("Trabajador registrado correctamente"), 
    (error) => {
        console.error("Error al enviar el formulario: ", error);    
        const result = error.response.data;            
        const messages = Object.values(result.message).map(error => error.message);            
        messages.forEach(msg => alertify.notify(msg, "error", 5));
    }, "register");
}

export function updateUsuario() {
    sendForm((result) => window.location.reload(), 
    (error) => {
        console.error("Error al enviar el formulario: ", error);
        const result = error.response.data;            
        const messages = Object.values(result.message).map(error => error.message);            
        messages.forEach(msg => alertify.notify(msg, "error", 5));
    }, "updateWorker");
}

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