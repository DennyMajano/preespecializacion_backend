module.exports = () => {
  const express = require("express");
  const router = express.Router();
  const usuariosController = require("../../controllers/Usuarios/Usuarios.controller")();
  const upload_files = require("../../middlewares/upload_files");
  const configPath = require("../../config.path");
  router.get("/usuarios/all", usuariosController.getAll);
  router.get("/usuarios/all/:filter", usuariosController.getAll);
  //   router.get("/cargos/select", usuariosController.getSelect);
  //   router.get("/cargos/select/:filter", usuariosController.getSelect);
  router.get("/usuarios/profile/:code", usuariosController.getImagen);
  router.get("/usuarios/validar/user/:valor", usuariosController.validar_user);
  router.get("/usuarios/:code", usuariosController.getById);

  router.get(
    "/usuarios/validar/correo/:valor",
    usuariosController.validar_correo
  );
  router.post(
    "/usuarios",
    upload_files.upload_file(configPath.PATH_IMAGES, "usuarios", "imagen"),
    usuariosController.insertOne
  );
  router.put("/usuarios", usuariosController.updateOne);
  router.put("/usuarios/restablecer_pass", usuariosController.reset_pass);
  router.put("/usuarios/change_password", usuariosController.requestEmailToChangePassword);
  router.put("/usuarios/disable_enable", usuariosController.desactivarActivar);
  router.post("/usuarios/bloqueo", usuariosController.BloquearDesbloquear);

  return router;
};
