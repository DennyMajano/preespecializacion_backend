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
  // MUNICIPIOS
  // router.get(
  //   "/generales/municipios/all",
  //   generalesController.getSelectMunicipio
  // );
  router.get(
    "/generales/municipios/all/:dep",
    generalesController.getSelectMunicipio
  );
  router.get(
    "/generales/municipios/all/:dep/:filter",
    generalesController.getSelectMunicipio
  );
  // CANTONES
  router.get(
    "/generales/cantones/all",
    generalesController.getSelectCanton
  );
  router.get(
    "/generales/cantones/all/:municipio",
    generalesController.getSelectCanton
  );
  router.get(
    "/generales/cantones/all/:municipio/:filter",
    generalesController.getSelectCanton
  );
  // NACIONALIDADES
  router.get(
    "/generales/nacionalidades/select",
    generalesController.getSelectNacionalidad
  );
  router.get(
    "/generales/nacionalidades/select/:filter", 
    generalesController.getSelectNacionalidad);
  router.get(
    "/generales/comodin/all/:grupo",
    generalesController.getSelectMiselanea
  );
  router.get(
    "/generales/tipo_documento/all",
    generalesController.getSelectTipoDocumento
  );
  router.get(
    "/generales/tipo_iglesia/all",
    generalesController.getSelectTipoIglesia
  );

  // router.get("/generales/mail/:mensaje/:correo", generalesController.mail);
  // router.get("/cargos/all/:filter", generalesController.getAll);
  // router.get("/cargos/select", generalesController.getSelect);
  // router.get("/cargos/select/:filter", generalesController.getSelect);
  // router.get("/cargos/:code", generalesController.getById);
  // router.post("/cargos", generalesController.insertOne);
  // router.put("/cargos", generalesController.updateOne);
  // router.delete("/cargos", generalesController.DisableOrEnable);

  return router;
};
