const express = require("express");
const router = express.Router();
const userController = require("./../controllers/usuarios");
const { onlyPublic, simpleValidation } = require("../config/middlewares");
require('dotenv').config();

router.get("/", onlyPublic, userController.homePage);

router.get("/politicy", userController.politicy);

router.get("/login", onlyPublic, userController.loginGET);

router.post("/login", onlyPublic, simpleValidation, userController.loginUsuarioPOST);

router.post("/authentication", onlyPublic, userController.authenticationUsuario);

router.get("/deleteByEmail/:id", onlyPublic, userController.deleteByEmail)

module.exports = router;