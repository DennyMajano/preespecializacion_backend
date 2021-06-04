module.exports = () => {
  const express = require("express");
  const router = express.Router();
  const informeTesoreroMensualController =
    require("../../controllers/Informes/InformeTesoreroMensual.controller")();

  router.post(
    "/informe/tesorero/mensual",
    informeTesoreroMensualController.create
  );
  router.put(
    "/informe/tesorero/mensual",
    informeTesoreroMensualController.update
  );
  router.get(
    "/informe/tesorero/mensual/info/:codigo",
    informeTesoreroMensualController.getByCodigo
  );

  return router;
};
