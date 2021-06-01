

module.exports = () => {
    const express = require("express");
    const router = express.Router();
    const informeMinisterialMensualController = require("../../controllers/Informes/InformeMinisterialMensual.controller")();

    router.post("/informe/ministerial/mensual/cabecera", informeMinisterialMensualController.createCabeceraInforme);
    router.post("/informe/ministerial/mensual/detalle", informeMinisterialMensualController.createDetalleInforme);
    router.put("/informe/ministerial/mensual/detalle", informeMinisterialMensualController.updateDetalleInforme);
    router.get("/informe/ministerial/mensual/info/:codigo", informeMinisterialMensualController.getByCodigo);
    router.put("/informe/ministerial/enviar/", informeMinisterialMensualController.setProcesado);
    router.post("/informe/ministerial/mensual/", informeMinisterialMensualController.create);
    return router;
  };
  