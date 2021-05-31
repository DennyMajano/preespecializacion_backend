

module.exports = () => {
    const express = require("express");
    const router = express.Router();
    const periodosController = require("../../controllers/PeriodosMinisteriales/PeriodosMinisteriales.controller")();

    router.post("/periodos", periodosController.create);
    router.put("/periodos", periodosController.update);
    router.get("/periodos/all/:filter", periodosController.getAll);
    router.get("/periodos/all", periodosController.getAll);
    router.get("/periodos/estado/:estado", periodosController.getByState);
    router.get("/periodo/:codigo", periodosController.getByCodigoOrId);
    router.delete("/periodo", periodosController.delete);
    router.put("/periodo/finalizar", periodosController.finalizarPeriodo);
    router.put("/periodo/vigente", periodosController.ponerVigentePeriodo);
    router.get("/periodo/finalizar/:codigo", periodosController.isPeriodoMinisterialValidForFinalizar);
   /*  router.put("/pastores/status", periodosController.updateStatus);
    router.put("/pastores/enable", periodosController.enableDisable);
    router.get("/pastores/select/:filter", periodosController.getSelect);

    router.get("/pastores/modal/:filter", periodosController.getFilterModal);
    router.get("/pastores/modal", periodosController.getFilterModal);
    router.get("/pastores/:code", periodosController.getById); */
    
    return router;
  };
  