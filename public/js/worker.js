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

function downloadData() {
    TableToExcel.convert(document.getElementById("myData"), {
        name: "DatosPersonales.xlsx"
    });
}

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