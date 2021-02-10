module.exports = () => {
  const express = require("express");
  const router = express.Router();
  const tipoDocumentoController = require("../../controllers/TipoDocumento/TipoDocumento.controller")();

  router.get("/tipo_documento/all", tipoDocumentoController.getAll);
  router.get("/tipo_documento/all/:filter", tipoDocumentoController.getAll);
  router.get("/tipo_documento/select", tipoDocumentoController.getSelect);
  router.get(
    "/tipo_documento/select/:filter",
    tipoDocumentoController.getSelect
  );
  router.get("/tipo_documento/:code", tipoDocumentoController.getById);
  router.post("/tipo_documento", tipoDocumentoController.insertOne);
  router.put("/tipo_documento", tipoDocumentoController.updateOne);
  router.delete("/tipo_documento", tipoDocumentoController.DisableOrEnable);

  return router;
};
