module.exports = () => {
    const express = require("express");
    const router = express.Router();
    const zonasController = require("../../controllers/Zonas/Zonas.controller")();
    const zonasDepartamentosController = require("../../controllers/Zonas/Zonas_departamento.controller")();
  
    //rutas para zonas
    router.get("/zonas/all", zonasController.getAll);
    router.get("/zonas/all/:filter", zonasController.getAll);
    router.get("/zonas/select", zonasController.getSelect);
    router.get(
      "/zonas/select/:filter",
      zonasController.getSelect
    );
    router.get("/zonas/:code", zonasController.getById);
    router.post("/zonas", zonasController.insertOne);
    router.put("/zonas", zonasController.updateOne);
    router.delete("/zonas", zonasController.DisableOrEnable);
    //rutas para zonas departamentos
    router.post("/zonas_departamento", zonasDepartamentosController.insertOne);
    router.get("/zonas_departamento/:code/all", zonasDepartamentosController.getAll);
    router.get("/zonas_departamento/:code/all/:filter", zonasDepartamentosController.getAll);
    router.delete("/zonas_departamento", zonasDepartamentosController.delete);


  
    return router;
  };
  