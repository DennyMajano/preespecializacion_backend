module.exports = () => {
  const express = require("express");
  const router = express.Router();
  const personasController = require("../../controllers/Personas/Personas.controller")();
  const FilesUpload = require("../../middlewares/FilesUpload");
  //  router.get("/roles/all", personasController.getAll);
  //   router.get("/roles/all/:filter", personasController.getAll);
  router.post("/personas/create",FilesUpload.uploadSingle(process.env.PATH_USERS_FOLDER_PROFILES_IMAGES,"fotoPerfil"), personasController.insertOne);
  router.put("/personas/updateAvatar",FilesUpload.uploadSingle(process.env.PATH_USERS_FOLDER_PROFILES_IMAGES,"fotoPerfil"), personasController.updateAvatar);
  router.get("/persona/:code", personasController.getById);
  router.get("/personas/select", personasController.find);
  router.get("/personas/select/:filter", personasController.find);

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
