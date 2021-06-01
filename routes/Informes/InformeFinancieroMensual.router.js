module.exports = () => {
  const express = require("express");
  const router = express.Router();
  const informeFinancieroMensualController =
    require("../../controllers/Informes/InformeFinancieroMensual.controller")();

  router.post(
    "/informe/financiero/mensual/cabecera",
    informeFinancieroMensualController.createCabeceraInforme
  );
  router.post(
    "/informe/financiero/mensual/",
    informeFinancieroMensualController.create
  );
  router.post(
    "/informe/financiero/mensual/detalle",
    informeFinancieroMensualController.createDetalleInforme
  );
  router.put(
    "/informe/financiero/mensual/detalle",
    informeFinancieroMensualController.updateDetalleInforme
  );

    router.get(
      "/informe/financiero/mensual/info/:codigo",
      informeFinancieroMensualController.getByCodigo
    );

  return router;
};
