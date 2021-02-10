module.exports = () => {
  const express = require("express");
  const router = express.Router();
  const generalesController = require("../../controllers/Generales/Generales.controller")();

  router.get(
    "/generales/estado_civil/all",
    generalesController.getSelectEstadoCivil
  );
  router.get(
    "/generales/departamentos/all",
    generalesController.getSelectDepartamento
  );
  router.get(
    "/generales/comodin/all/:grupo",
    generalesController.getSelectMiselanea
  );

  router.get("/generales/sexo/all", generalesController.getSelectSexo);
  router.get(
    "/generales/tipo_documento_identificacion/all",
    generalesController.getSelectTipoDocumentoIdentificacion
  );
  router.get(
    "/generales/motivos_baja/all",
    generalesController.getSelectMotivosBaja
  );
  router.get(
    "/generales/tipos_saldos/all",
    generalesController.getSelectTiposSaldos
  );

  router.get(
    "/generales/tipo_cuenta/all",
    generalesController.getSelectTipoCuenta
  );
  router.get(
    "/generales/tipo_proyecto/all",
    generalesController.getSelectTipoProyecto
  );
  router.get("/generales/mail/:mensaje", generalesController.mail);
  // router.get("/cargos/all/:filter", generalesController.getAll);
  // router.get("/cargos/select", generalesController.getSelect);
  // router.get("/cargos/select/:filter", generalesController.getSelect);
  // router.get("/cargos/:code", generalesController.getById);
  // router.post("/cargos", generalesController.insertOne);
  // router.put("/cargos", generalesController.updateOne);
  // router.delete("/cargos", generalesController.DisableOrEnable);

  return router;
};
