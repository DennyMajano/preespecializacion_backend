

module.exports = () => {
    const express = require("express");
    const router = express.Router();
    const informeTesoreroMensualController = require("../../controllers/Informes/InformeTesoreroMensual.controller")();

    router.post("/informe/tesorero/mensual/cabecera", informeTesoreroMensualController.createCabeceraInforme);
    router.post("/informe/tesorero/mensual/detalle", informeTesoreroMensualController.createDetalleInforme);
   /*  router.put("/informe/tesorero/mensual/detalle", informeTesoreroMensualController.updateDetalleInforme);
    router.get("/informe/tesorero/mensual/info/:codigo", informeTesoreroMensualController.getByCodigo);
        */
    return router;
  };
  