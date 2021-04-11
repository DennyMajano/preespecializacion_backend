

module.exports = () => {
    const express = require("express");
    const router = express.Router();
    const informeMinisterialMensualController = require("../../controllers/Informes/InformeMinisterialMensual.controller")();

    router.post("/informe/ministerial/mensual/cabecera", informeMinisterialMensualController.createCabeceraInforme);
    router.post("/informe/ministerial/mensual/detalle", informeMinisterialMensualController.createDetalleInforme);
    router.put("/periodos", informeMinisterialMensualController.update);
    router.get("/periodos/all/:filter", informeMinisterialMensualController.getAll);
    router.get("/periodos/all", informeMinisterialMensualController.getAll);
    router.get("/periodos/estado/:estado", informeMinisterialMensualController.getByState);
    router.get("/periodo/:codigo", informeMinisterialMensualController.getByCodigoOrId);
    router.delete("/periodo", informeMinisterialMensualController.delete);
    router.put("/periodo/finalizar", informeMinisterialMensualController.finalizarPeriodo);
    router.put("/periodo/vigente", informeMinisterialMensualController.ponerVigentePeriodo);
    router.get("/periodo/finalizar/:codigo", informeMinisterialMensualController.isPeriodoMinisterialValidForFinalizar);
   
    return router;
  };
  