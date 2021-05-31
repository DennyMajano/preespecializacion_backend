const modelIglesiaReporte = require("../../models/Iglesias/IglesiasReportes.model");
const isUndefinedOrNull = require("validate.io-undefined-or-null");
module.exports = () => {
  let iglesia_reporte = {};

  iglesia_reporte.insertOne = async (req, res) => {
    const data = req.body;
    console.log(data);
    try {
      if (
        !isUndefinedOrNull(data.iglesia) &&
        !isUndefinedOrNull(data.informe)
      ) {
        let result = await modelIglesiaReporte.create(data);
        if (result.errno) {
          switch (result.errno) {
            case 1062:
              res.status(409).json("Informe ya existe");

              break;

            default:
              console.log(result);
              res.status(500).json("Error de servidor");

              break;
          }
        } else if (result.affectedRows === 1) {
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

  iglesia_reporte.getAll = async (req, res) => {
    const { filter, iglesia } = req.params;

    try {
      let result = await modelIglesiaReporte.findAll(filter, iglesia);

      if (result.errno) {
        res.status(500).json("Error de servidor");
      } else if (result.length >= 0) {
        res.status(200).json(result);
      }
    } catch (error) {
      console.log(error);
    }
  };

  iglesia_reporte.delete = async (req, res) => {
    const data = req.body;
    console.log(data);
    try {
      if (!isUndefinedOrNull(data.code)) {
        let result = await modelIglesiaReporte.delete(data);
        console.log(result);
        if (result.errno) {
          res.status(500).json("Error de servidor");
        } else if (result.affectedRows > 0) {
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
  return iglesia_reporte;
};
