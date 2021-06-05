module.exports = () => {
  const express = require("express");
  const router = express.Router();
  const informeMinisterialMensualController =
    require("../../controllers/Informes/InformeMinisterialMensual.controller")();

  router.put(
    "/informe/ministerial/mensual/",
    informeMinisterialMensualController.update
  );
  router.get(
    "/informe/ministerial/mensual/info/:codigo",
    informeMinisterialMensualController.getByCodigo
  );
  router.post(
    "/informe/ministerial/mensual/",
    informeMinisterialMensualController.create
  );
  return router;
};
