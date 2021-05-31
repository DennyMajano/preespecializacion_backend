module.exports = () => {
  const express = require("express");
  const router = express.Router();
  const maestroController = require("../../controllers/MaestroInforme/MaestroInforme.controller")();

  //rutas para Maestro_de_informes
  router.get("/maestro_informe/all", maestroController.getAll);
  router.get("/maestro_informe/all/:filter", maestroController.getAll);
  router.get("/maestro_informe/select", maestroController.getSelect);
  router.get("/maestro_informe/select/:filter", maestroController.getSelect);
  router.get(
    "/maestro_informe/select/tipo/:tipo",
    maestroController.getSelectTipo
  );
  router.get(
    "/maestro_informe/select/tipo/:tipo/:filter",
    maestroController.getSelectTipo
  );
  router.get("/maestro_informe/:code", maestroController.getById);
  router.post("/maestro_informe", maestroController.insertOne);
  router.put("/maestro_informe", maestroController.updateOne);
  router.delete("/maestro_informe", maestroController.DisableOrEnable);

  return router;
};
