import { getGeneralInformation } from "./dashboard.js";
import { registerWorker, registerWorker, updateWorker } from "./form.js"
import { profileActions, activeAccordion } from "./worker.js";

window.onload = () => {
    if (document.getElementById("register")) registerWorker();
    if (document.getElementById("dashboard")) getGeneralInformation(); 
    if (document.getElementById("customers")) activeAccordion();
    if (document.getElementById("workerList")) activeAccordion();
    if (document.getElementById("worker")) profileActions();
    if (document.getElementById("updateWorker")) updateWorker();
};