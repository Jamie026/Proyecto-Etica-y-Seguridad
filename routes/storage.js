const express = require("express");
const storage = express.Router();
const storageController = require("./../controllers/storage");
const { onlyLogged } = require("./../config/middlewares");

storage.get("/ageCustomersExited", onlyLogged, storageController.ageCustomersExited);

storage.get("/cardTypes", onlyLogged, storageController.cardTypes);

storage.get("/customersByCountry", onlyLogged, storageController.customersByCountry);

storage.get("/generalInformation", onlyLogged, storageController.generalInformation);

module.exports = storage ;