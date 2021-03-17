

module.exports = () => {
    const express = require("express");
    const router = express.Router();
    const pastoresController = require("../../controllers/Pastores/Pastores.controller");

    router.post("/pastores", pastoresController.create);
    router.put("/pastores", pastoresController.update);
    router.put("/pastores/status", pastoresController.updateStatus);
    router.get("/pastores/select/:filter", pastoresController.getSelect);
    router.get("/pastores/all/:filter", pastoresController.getFilter);
    router.get("/pastores/:code", pastoresController.getById);
    
    return router;
  };
  