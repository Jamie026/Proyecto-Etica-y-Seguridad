const express = require("express");
const dashboard = express.Router();
const dashboardController = require("./../controllers/dashboard");
const { onlyLogged, completeValidation, onlyAdmin } = require("./../config/middlewares");

dashboard.get("/", onlyLogged, dashboardController.homePage);

dashboard.get("/customers", onlyLogged, dashboardController.customers)

dashboard.post("/customers", onlyLogged, dashboardController.customersFilter);

dashboard.get("/workers", onlyLogged, onlyAdmin, dashboardController.workers);

dashboard.post("/workers", onlyLogged, onlyAdmin, dashboardController.workersFilter);

dashboard.post("/register", onlyLogged, onlyAdmin, completeValidation, dashboardController.registerWorker);

dashboard.get("/updateAcceso/:id/:value", onlyLogged, onlyAdmin, dashboardController.updateAcceso);

dashboard.get("/updateAdministrador/:id/:value", onlyLogged, onlyAdmin, dashboardController.updateAdministrador);

dashboard.get("/profile", onlyLogged, dashboardController.profile);

dashboard.get("/changePrivacity", onlyLogged, dashboardController.changePrivacity)

dashboard.post("/updateWorker", onlyLogged, completeValidation, dashboardController.updateWorker)

dashboard.get("/deleteWorker", onlyLogged, dashboardController.deleteWorker)

dashboard.get("/logout", onlyLogged, dashboardController.logout);

module.exports = dashboard ;