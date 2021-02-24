module.exports = () => {
  const express = require("express");
  const router = express.Router();
  const iglesiasController = require("../../controllers/Iglesias/Iglesias.controller")();
  const zonasDepartamentosController = require("../../controllers/Zonas/Zonas_departamento.controller")();

  //rutas para zonas
  router.get("/iglesias/all", iglesiasController.getAll);
  router.get("/iglesias/all/:filter", iglesiasController.getAll);
  router.get("/iglesias/select", iglesiasController.getSelect);
  router.get("/iglesias/select/:filter", iglesiasController.getSelect);
  router.get("/iglesias/:code", iglesiasController.getById);
  router.post("/iglesias", iglesiasController.insertOne);
  router.put("/iglesias", iglesiasController.updateOne);
  router.delete("/iglesias", iglesiasController.DisableOrEnable);
  //rutas para zonas departamentos
  router.post("/zonas_departamento", zonasDepartamentosController.insertOne);
  router.get(
    "/zonas_departamento/:code/all",
    zonasDepartamentosController.getAll
  );
  router.get(
    "/zonas_departamento/:code/all/:filter",
    zonasDepartamentosController.getAll
  );
  router.delete("/zonas_departamento", zonasDepartamentosController.delete);

  return router;
};
