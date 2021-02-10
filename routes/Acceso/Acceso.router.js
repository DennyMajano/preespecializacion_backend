module.exports = () => {
  const express = require("express");
  const router = express.Router();
  const accesoController = require("../../controllers/Acceso/Acceso.controller")();

  router.post("/login", accesoController.login);

  return router;
};
