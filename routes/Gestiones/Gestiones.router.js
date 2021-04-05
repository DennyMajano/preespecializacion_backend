const express = require("express");
const router = express.Router();
const gestionesController = require("../../controllers/Gestiones/Gestiones.controller")();

module.exports = () => {
  router.post("/gestiones", gestionesController.create);
  router.post("/gestion/asignacion", gestionesController.asignarInforme);
  router.put("/gestiones", gestionesController.update);
  router.delete("/gestion", gestionesController.delete);
  router.delete("/gestion/asignacion", gestionesController.deleteAsignacionInforme);
  router.get("/gestion/:codigo", gestionesController.getByCodigoOrId);
  router.get("/gestiones/activas", gestionesController.getGestionesActivas);
  router.get("/gestiones/informes/:codigo", gestionesController.getInformesAsignados);
  router.get("/gestion/iglesias/enviado/:codigo", gestionesController.getIglesiasQueHanReportado);
  /*   router.get("/periodos/all/:filter", periodosController.getAll);
    router.get("/periodos/all", periodosController.getAll);
    router.get("/periodos/estado/:estado", periodosController.getByState);
    router.get("/periodo/:codigo", periodosController.getByCodigoOrId);
   
    router.put("/periodo/finalizar", periodosController.finalizarPeriodo);
    router.put("/periodo/vigente", periodosController.ponerVigentePeriodo); */
    return router;
};
