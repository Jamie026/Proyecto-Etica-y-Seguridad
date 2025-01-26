/**
 * Asigna funciones de activación a ciertos elementos con ayuda de su ID.
 */
export function profileActions() {
    const actions = {
        "delete-worker": deleteWorker,
        "visible": chanceVisibily,
        "downloadData": downloadData,
    };

    Object.keys(actions).forEach(elementId => {
        const element = document.getElementById(elementId);
        if (element) element.addEventListener("click", actions[elementId]);
    });
}

/**
 * Extrae la información del elemento tabla HTML con ID "myData" y lo convierte a EXCEL para descargarlo.
 */
function downloadData() {
    TableToExcel.convert(document.getElementById("myData"), {
        name: "DatosPersonales.xlsx"
    });
}

/**
 * Actualiza la visibilidad del nombre de usuario del trabajador logueado para los demas trabajadores.
 */
async function chanceVisibily() {
    try {
        const result = await axios.get("https://localhost:3000/dashboard/changePrivacity");
        document.getElementById("visible").textContent = result.data.textContent;
        alertify.success("Se ha modificado la visibilidad de su usuario.");
    } catch (error) {
        console.error("Error al cambiar el estado: ", error);
        const errorMessage = error.response.data.message;    
        alertify.notify(errorMessage, "error", 5)            
    }
}

/**
 * Elimina la cuenta del trabajador logueado y las cookies.
 */
async function deleteWorker() {
    try {
        alertify.confirm("Confirmación de eliminación", "¿Seguro que quiere eliminar su cuenta?", async () => {
            alertify.warning("Eliminando cuenta...");
            await axios.get("https://localhost:3000/dashboard/deleteWorker");
            window.location.reload();
        }, () => alertify.error("Eliminación cancelada."));
    } catch (error) {
        console.error("Error al eliminar cuenta: ", error);
        const errorMessage = error.response.data.message;    
        alertify.notify(errorMessage, "error", 5);
    }
}

/**
 * Permite la funcionalidad de acordeon para ciertos elementos HTML con la clase "container-card-accordion".
 */
export function activeAccordion() {
    const accordion = document.getElementsByClassName("container-card-accordion");
    Array.from(accordion).forEach(card => {
        card.addEventListener("click", function() {
            this.classList.toggle("container-card-accordion-active");
            const panel = this.nextElementSibling;
            panel.style.maxHeight = panel.style.maxHeight ? null : panel.scrollHeight + "px";
        });
    });
}