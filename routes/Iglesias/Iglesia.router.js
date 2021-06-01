const IglesiasReportesController = require("../../controllers/Iglesias/IglesiasReportes.controller");

module.exports = () => {
  const express = require("express");
  const router = express.Router();
  const iglesiasController =
    require("../../controllers/Iglesias/Iglesias.controller")();
  const iglesiasReportes =
    require("../../controllers/Iglesias/IglesiasReportes.controller")();

  //rutas para zonas
  router.get("/iglesias/all", iglesiasController.getAll);
  router.get("/iglesias/all/:filter", iglesiasController.getAll);
  router.get("/iglesias/visor/all", iglesiasController.getAllVisor);
  router.get("/iglesias/visor/all/:filter", iglesiasController.getAllVisor);
  router.get("/iglesias/select", iglesiasController.getSelect);
  router.get("/iglesias/select/:filter", iglesiasController.getSelect);
  router.get(
    "/iglesias/distrito/:distrito",
    iglesiasController.getSelectByDistrito
  );
  router.get(
    "/iglesias/distrito/:distrito/:filter",
    iglesiasController.getSelectByDistrito
  );

  router.get(
    "/iglesias/asignadas/:usuario",
    iglesiasController.getIglesiasAsignadas
  );
  router.get(
    "/iglesias/asignadas/:usuario/:filter",
    iglesiasController.getIglesiasAsignadas
  );
  router.get("/iglesias/:code", iglesiasController.getById);
  router.get("/iglesias/detalle/:code", iglesiasController.getDetalleById);
  router.get("/iglesias/informe/:code", iglesiasController.getInformeById);
  router.post("/iglesias", iglesiasController.insertOne);
  router.put("/iglesias", iglesiasController.updateOne);
  router.delete("/iglesias", iglesiasController.DisableOrEnable);

  router.post("/iglesias_informes", iglesiasReportes.insertOne);
  router.get("/iglesias_informes/all/:iglesia", iglesiasReportes.getAll);
  router.get(
    "/iglesias_informes/all/:iglesia/:filter",
    iglesiasReportes.getAll
  );
  router.delete("/iglesias_informes", iglesiasReportes.delete);

  return router;
};
