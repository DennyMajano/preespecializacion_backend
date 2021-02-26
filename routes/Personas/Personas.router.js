module.exports = () => {
  const express = require("express");
  const router = express.Router();
  const personasController = require("../../controllers/Personas/Personas.controller")();
  const FilesUpload = require("../../middlewares/FilesUpload");
  //  router.get("/roles/all", personasController.getAll);
  //   router.get("/roles/all/:filter", personasController.getAll);
  router.post("/personas/create",FilesUpload.uploadSingle(process.env.PATH_USERS_FOLDER_PROFILES_IMAGES,"fotoPerfil"), personasController.insertOne);
  router.put("/personas/update", personasController.update);
  router.put("/personas/updateAvatar",FilesUpload.uploadSingle(process.env.PATH_USERS_FOLDER_PROFILES_IMAGES,"fotoPerfil"), personasController.updateAvatar);
  router.get("/persona/:code", personasController.getById);
  router.get("/personas/find", personasController.findAll);
  router.get("/personas/find/:filter", personasController.findAll);
  router.get("/personas/select", personasController.findSelect);
  router.get("/personas/select/:filter", personasController.findSelect);
  router.get("/personas/findok", personasController.findAllInOk);
  router.get("/personas/findok/:filter", personasController.findAllInOk);
  router.get("/personas/phone/:phoneNumber", personasController.findPhoneNumber);
  router.get("/personas/document/:documentNumber", personasController.findDocumentNumber);
  router.put("/personas/enable", personasController.disableOrEnable);
  router.put("/personas/died", personasController.setDied);
  

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
