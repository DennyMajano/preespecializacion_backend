const ModelZonas_departamento = require("../../models/Zonas/Zonas_departamento.model");
const isUndefinedOrNull = require("validate.io-undefined-or-null");

module.exports = () => {
  let zona_departamento = {};

  zona_departamento.insertOne = async (req, res) => {
    const data = req.body;

    try {
      if (!isUndefinedOrNull(data.zona) && !isUndefinedOrNull(data.departamento)) {
        let result = await ModelZonas_departamento.create(data);
        if (result.errno) {
          switch (result.errno) {
            case 1062:
             res.status(409).json("Ya ha sido asignado este departamento a la zona");
              break;
          
            default:
             res.status(500).json("Error de servidor");
              break;
          }
        } else if (result.affectedRows > 0) {
          res.status(201).json("Se creo con exito");
        } else {
          res.status(400).json("No se pudo crear");
        }
      } else {
        res.status(400).json("faltan datos para realizar el proceso");
      }
    } catch (error) {
      console.log(error);
    }
  };

  zona_departamento.getAll = async (req, res) => {
    const { filter,code } = req.params;

    try {
      let result = await ModelZonas_departamento.findAll(filter,code);
      console.log(result);
      if (result.errno) {
        res.status(500).json("Error de servidor");
      } else if (result.length >= 0) {
        res.status(200).json(result);
      }
    } catch (error) {
      console.log(error);
    }
  };

  zona_departamento.delete = async (req, res) => {
    const data = req.body;
    
    try {
      if (!isUndefinedOrNull(data.code)) {
        let result = await ModelZonas_departamento.delete(data);
        if (result.errno) {
          res.status(500).json("Error de servidor");
        } else if (result.affectedRows === 1) {
          res.status(200).json("Proceso se realizó con exito");
        } else {
          res.status(400).json("No se pudo realiar el proceso");
        }
      } else {
        res.status(400).json("faltan datos para realizar el proceso");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return zona_departamento;
};
