module.exports = () => {
    const express = require("express");
    const router = express.Router();
    const nivelAcademicoController = require("../../controllers/NivelesAcademicos/NivelesAcademicos.controller")();
  
    //rutas para Maestro_de_informes
    router.get("/nivel_academico/all", nivelAcademicoController.getAll);
    router.get("/nivel_academico/all/:filter", nivelAcademicoController.getAll);
    router.get("/nivel_academico/select", nivelAcademicoController.getSelect);
    router.get("/nivel_academico/select/:filter", nivelAcademicoController.getSelect);
    router.get("/nivel_academico/:code", nivelAcademicoController.getById);
    router.post("/nivel_academico", nivelAcademicoController.insertOne);
    router.put("/nivel_academico", nivelAcademicoController.updateOne);
    router.delete("/nivel_academico", nivelAcademicoController.DisableOrEnable);
  
    return router;
  };
  