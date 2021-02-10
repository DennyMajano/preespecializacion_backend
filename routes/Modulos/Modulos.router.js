module.exports = () => {
  const express = require("express");
  const router = express.Router();
  const modulosController = require("../../controllers/Modulos/Modulos.controller")();

  router.get("/modulos/all", modulosController.getAll);
  router.get("/modulos/all/:filter", modulosController.getAll);
  router.get("/modulos/children/:id_padre", modulosController.getbypadre);
  router.get("/modulos/select", modulosController.getSelect);
  router.get("/modulos/select/:filter", modulosController.getSelect);
  router.get("/modulos/:code", modulosController.getById);
  router.post("/modulos", modulosController.insertOne);
  router.put("/modulos", modulosController.updateOne);
  router.delete("/modulos", modulosController.DisableOrEnable);

  return router;
};
