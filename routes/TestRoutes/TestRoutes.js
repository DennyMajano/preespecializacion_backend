module.exports = () => {
  const express = require("express");
  const router = express.Router();
  const FilesUpload = require("../../middlewares/FilesUpload");
  //TEST PARA SUBIR ARCHIVOS
  router.post("/upload",FilesUpload.uploadSingle("testFolder/test","test"),(req,res, next)=>{
    res.send("guardado");
  });
  router.post("/uploadu",FilesUpload.uploadSingle("testFolder","test",true),(req,res, next)=>{
    res.send("guardado");
  });
  router.post("/uploadm",FilesUpload.uploadMultiple("testMultipleFolder","test",3),(req,res, next)=>{
    res.send("guardado");
  });
  router.post("/uploadmu",FilesUpload.uploadMultiple("testMultipleFolder","test",3,true),(req,res, next)=>{
    res.send("guardado");
  }); 
  router.post("/example",(req,res, next)=>{
    res.send("exito");
  });
  return router;
}