module.exports = () => {
  const express = require("express");
  const router = express.Router();
  const rolesController = require("../../controllers/Roles/Roles.controller")();
  const rolesModulosController = require("../../controllers/Roles/Roles_modulos.controller")();

  router.get("/roles/all", rolesController.getAll);
  router.get("/roles/all/:filter", rolesController.getAll);
  router.get("/roles/select", rolesController.getSelect);
  router.get("/roles/select/:filter", rolesController.getSelect);
  router.get("/roles/:code", rolesController.getById);
  router.post("/roles", rolesController.insertOne);
  router.put("/roles", rolesController.updateOne);
  router.delete("/roles", rolesController.DisableOrEnable);

  router.post("/roles_modulos", rolesModulosController.insertOne);
  router.get("/roles_modulos/all/:rol", rolesModulosController.getAll);
  router.get("/roles_modulos/all/:rol/:filter", rolesModulosController.getAll);
  router.delete("/roles_modulos", rolesModulosController.delete);

  return router;
};
