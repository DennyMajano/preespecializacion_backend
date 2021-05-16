const express = require("express");
const router = express.Router();
const gestionesController =
  require("../../controllers/Gestiones/Gestiones.controller")();

module.exports = () => {
  router.post("/gestiones", gestionesController.create);
  router.post("/gestion/asignacion", gestionesController.asignarInforme);
  router.put("/gestiones", gestionesController.update);
  router.put("/gestion/publicar", gestionesController.publicarGestion);
  router.put("/gestion/cerrar", gestionesController.cerrarGestion);
  router.delete("/gestion", gestionesController.delete);
  router.delete(
    "/gestion/asignacion",
    gestionesController.deleteAsignacionInforme
  );
  router.get("/gestion/:codigo", gestionesController.getByCodigoOrId);
  router.get(
    "/gestion/iglesia/detalle/:codigoGestion/:codigoIglesia",
    gestionesController.getDetalleDeInformesDeIglesia
  );
  router.get(
    "/gestion/iglesia/informes/:codigoGestion/:codigoIglesia",
    gestionesController.getDetalleDeInformesDeIglesiaAEnviar
  );
  router.get(
    "/gestiones/disponibles/iglesia/:codigoIglesia",
    gestionesController.getActivasEnvioDeIglesias
  );
  /*   router.get(
    "/gestion/:codigoGestion/iglesia/:codigoIglesia/informes",
    gestionesController.getDetalleDeInformesDeIglesia
  ); */
  router.get("/gestiones/activas", gestionesController.getGestionesActivas);
  router.get("/gestiones/inactivas", gestionesController.getGestionesInactivas);
  router.get(
    "/gestiones/informes/:codigo",
    gestionesController.getInformesAsignados
  );
  router.get(
    "/gestion/iglesias/enviado/:codigo",
    gestionesController.getIglesiasQueHanReportado
  );
  return router;
};
