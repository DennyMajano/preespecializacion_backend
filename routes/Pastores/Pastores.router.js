

module.exports = () => {
    const express = require("express");
    const router = express.Router();
    const pastoresController = require("../../controllers/Pastores/Pastores.controller")();

    router.post("/pastores", pastoresController.create);
    router.put("/pastores", pastoresController.update);
    router.put("/pastores/status", pastoresController.updateStatus);
    router.put("/pastores/enable", pastoresController.enableDisable);
    router.get("/pastores/select/:filter", pastoresController.getSelect);
    router.get("/pastores/all/:filter", pastoresController.getAll);
    router.get("/pastores/all", pastoresController.getAll);
    router.get("/pastores/modal/:filter", pastoresController.getFilterModal);
    router.get("/pastores/modal", pastoresController.getFilterModal);
    router.get("/pastores/:code", pastoresController.getById);
    
    return router;
  };
  