module.exports = () => {
    const express = require("express");
    const router = express.Router();
    const nivelPastorController = require("../../controllers/NivelPastor/NivelPastor.controller")();
  
    //rutas para Maestro_de_informes
    router.get("/nivel_pastor/all", nivelPastorController.getAll);
    router.get("/nivel_pastor/all/:filter", nivelPastorController.getAll);
    router.get("/nivel_pastor/select", nivelPastorController.getSelect);
    router.get("/nivel_pastor/select/:filter", nivelPastorController.getSelect);
    router.get("/nivel_pastor/:code", nivelPastorController.getById);
    router.post("/nivel_pastor", nivelPastorController.insertOne);
    router.put("/nivel_pastor", nivelPastorController.updateOne);
    router.delete("/nivel_pastor", nivelPastorController.DisableOrEnable);
  
    return router;
  };
  