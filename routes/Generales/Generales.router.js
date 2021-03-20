module.exports = () => {
  const express = require("express");
  const router = express.Router();
  const generalesController = require("../../controllers/Generales/Generales.controller")();

  router.get(
    "/generales/estado_civil",
    generalesController.getSelectEstadoCivil
  );
  router.get(
    "/generales/departamentos",
    generalesController.getSelectDepartamento
  );
  router.get(
    "/generales/municipios/:dep",
    generalesController.getSelectMunicipio
  );
  router.get(
    "/generales/municipios/:dep/:filter",
    generalesController.getSelectMunicipio
  );
  // CANTONES
  router.get("/generales/cantones", generalesController.getSelectCanton);
  router.get(
    "/generales/cantones/:municipio",
    generalesController.getSelectCanton
  );
  router.get(
    "/generales/cantones/:municipio/:filter",
    generalesController.getSelectCanton
  );
  // NACIONALIDADES
  router.get(
    "/generales/nacionalidad",
    generalesController.getSelectNacionalidad
  );
  router.get(
    "/generales/nacionalidad/:filter",
    generalesController.getSelectNacionalidad
  );
  router.get(
    "/generales/comodin/:grupo",
    generalesController.getSelectMiselanea
  );
  router.get(
    "/generales/tipo_documento",
    generalesController.getSelectTipoDocumento
  );
  router.get(
    "/generales/tipo_iglesia",
    generalesController.getSelectTipoIglesia
  );
  router.get(
    "/generales/profesiones",
    generalesController.getSelectProfesiones
  );
  router.get(
    "/generales/profesiones/:filter",
    generalesController.getSelectProfesiones
  );
  router.get(
    "/generales/tipo_informe",
    generalesController.getSelectTipoInforme
  );

  return router;
};
