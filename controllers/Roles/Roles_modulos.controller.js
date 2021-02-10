const modelRolModulo = require("../../models/Roles/Roles_modulos.model");
const isUndefinedOrNull = require("validate.io-undefined-or-null");
module.exports = () => {
  let rol_modulo = {};

  rol_modulo.insertOne = async (req, res) => {
    const data = req.body;
    console.log(data);
    try {
      if (!isUndefinedOrNull(data.modulo) && !isUndefinedOrNull(data.rol)) {
        let result = await modelRolModulo.create(data);
        if (result.errno) {
          switch (result.errno) {
            case 1062:
              res.status(409).json("Módulo ya existe");

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

  rol_modulo.getAll = async (req, res) => {
    const { filter, rol } = req.params;

    try {
      let result = await modelRolModulo.findAll(filter, rol);

      if (result.errno) {
        res.status(500).json("Error de servidor");
      } else if (result.length >= 0) {
        res.status(200).json(result);
      }
    } catch (error) {
      console.log(error);
    }
  };

  rol_modulo.getSelect = async (req, res) => {
    const { filter } = req.params;
    console.log(filter);
    try {
      let result = await modelRolModulo.findSelect(filter);
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
  rol_modulo.getById = async (req, res) => {
    const { code } = req.params;
    console.log(code);
    try {
      let result = await modelRolModulo.findById(code);

      if (result.errno) {
        res.status(500).json("Error de servidor");
      } else if (result.length > 0) {
        console.log(result);
        res.status(200).json(result.length > 0 ? result[0] : result);
      } else {
        res.status(404).send();
      }
    } catch (error) {
      console.log(error);
    }
  };

  rol_modulo.delete = async (req, res) => {
    const data = req.body;
    console.log(data);
    try {
      if (!isUndefinedOrNull(data.code)) {
        let result = await modelRolModulo.delete(data);
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
  return rol_modulo;
};
