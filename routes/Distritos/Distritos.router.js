module.exports = () => {
  const express = require("express");
  const router = express.Router();
  const distritoController = require("../../controllers/Distritos/Distritos.controller")();

  //rutas para zonas
  router.get("/distritos/all", distritoController.getAll);
  router.get("/distritos/all/:filter", distritoController.getAll);
  router.get("/distritos/select", distritoController.getSelect);
  router.get("/distritos/select/:filter", distritoController.getSelect);
  router.get("/distritos/:code", distritoController.getById);
  router.post("/distritos", distritoController.insertOne);
  router.put("/distritos", distritoController.updateOne);
  router.delete("/distritos", distritoController.DisableOrEnable);

  return router;
};
