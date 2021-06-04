module.exports = () => {
  const express = require("express");
  const router = express.Router();
  const informeFinancieroMensualController =
    require("../../controllers/Informes/InformeFinancieroMensual.controller")();

  router.post(
    "/informe/financiero/mensual/",
    informeFinancieroMensualController.create
  );
  router.put(
    "/informe/financiero/mensual",
    informeFinancieroMensualController.update
  );
  router.get(
    "/informe/financiero/mensual/info/:codigo",
    informeFinancieroMensualController.getByCodigo
  );

  return router;
};
