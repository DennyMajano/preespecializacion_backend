const express = require("express");
const router = express.Router();
const gestionesController =
  require("../../controllers/Gestiones/Gestiones.controller")();
const FilesUpload = require("../../middlewares/FilesUpload");
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
    gestionesController.getDetalleDeInformesAEnviarDeIglesia
  );
  router.get(
    "/gestion/iglesia/informes/:codigoGestion/:codigoIglesia",
    gestionesController.getDetalleDeInformesDeIglesiaAEnviar
  );
  router.get(
    "/gestiones/disponibles/iglesia/:codigoIglesia",
    gestionesController.getActivasEnvioDeIglesias
  );
  router.get("/gestiones/activas", gestionesController.getGestionesActivas);
  router.get("/gestiones/inactivas", gestionesController.getGestionesInactivas);
  router.get(
    "/gestiones/informes/:codigo",
    gestionesController.getInformesAsignados
  );
  router.get(
    "/gestiones/informes/iglesias/enviados/:codigoGestion/:idInforme",
    gestionesController.getIglesiasConInformeEnviadoEnGestion
  );
  router.get(
    "/gestiones/informes/iglesias/no_enviados/:codigoGestion/:idInforme",
    gestionesController.getIglesiasConInformeNoEnviadoEnGestion
  );
  router.get(
    "/gestion/iglesias/enviado/:codigo",
    gestionesController.getIglesiasQueHanReportado
  );
  router.post(
    "/gestion/comprobante",
    FilesUpload.uploadSingle(
      process.env.PATH_GESTIONES_FOLDER_COMPROBANTES_DEPOSITOS,
      "imagenComprobante"
    ),
    gestionesController.guardarComprobanteDeposito
  );
  return router;
};
