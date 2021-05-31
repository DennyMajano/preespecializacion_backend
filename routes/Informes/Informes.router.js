
module.exports = () => {
    const express = require("express");
    const router = express.Router();
    const informeController = require("../../controllers/Informes/Informe.controller")();

    router.put("/informe/enviar", informeController.setProcesado);
       
    return router;
  };
  