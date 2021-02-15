module.exports = () => {
  const express = require("express");
  const router = express.Router();
  const personasController = require("../../controllers/Personas/Personas.controller")();

  //  router.get("/roles/all", personasController.getAll);
  //   router.get("/roles/all/:filter", personasController.getAll);
  router.get("/personas/select", personasController.getSelect);
  router.get("/personas/select/:filter", personasController.getSelect);
  //   router.get("/roles/:code", personasController.getById);
  //   router.post("/roles", personasController.insertOne);
  //   router.put("/roles", personasController.updateOne);
  //   router.delete("/roles", personasController.DisableOrEnable);

  //   router.post("/roles_modulos", rolesModulosController.insertOne);
  //   router.get("/roles_modulos/all/:rol", rolesModulosController.getAll);
  //   router.get("/roles_modulos/all/:rol/:filter", rolesModulosController.getAll);
  //   router.delete("/roles_modulos", rolesModulosController.delete);

  return router;
};
