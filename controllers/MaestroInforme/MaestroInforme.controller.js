const modelMaestro = require("../../models/MaestroInforme/MaestroInforme.model");
const isUndefinedOrNull = require("validate.io-undefined-or-null");

module.exports = () => {
  let maestro_informe = {};

  maestro_informe.insertOne = async (req, res) => {
    const data = req.body;
    console.log(data);
    try {
      if (
        !isUndefinedOrNull(data.nombre) &&
        !isUndefinedOrNull(data.tipo_informe)
      ) {
        let result = await modelMaestro.create(data);
        if (result.errno) {
          res.status(500).json("Error de servidor");
        } else if (result.affectedRows > 0) {
          res.status(201).json("Se creo con exito");
        } else {
          res.status(400).json("No se pudo crear");
        }
      } else {
        res.status(400).json("faltan datos para realizar el proceso");
      }
    } catch (error) {
      res.status(500).json("Error de servicio");
    }
  };
  maestro_informe.updateOne = async (req, res) => {
    const data = req.body;

    try {
      if (
        !isUndefinedOrNull(data.code) &&
        !isUndefinedOrNull(data.nombre) &&
        !isUndefinedOrNull(data.tipo_informe)
      ) {
        let result = await modelMaestro.update(data);
        if (result.errno) {
          res.status(500).json("Error de servidor");
        } else if (result.affectedRows > 0) {
          res.status(200).json("Se actualizo con exito");
        } else {
          res.status(400).json("No se pudo actualizar");
        }
      } else {
        res.status(400).json("faltan datos para realizar el proceso");
      }
    } catch (error) {
      res.status(500).json("Error de servicio");
    }
  };

  maestro_informe.getAll = async (req, res) => {
    const { filter } = req.params;

    try {
      let result = await modelMaestro.findAll(filter);

      if (result.errno) {
        res.status(500).json("Error de servidor");
      } else if (result.length >= 0) {
        res.status(200).json(result);
      }
    } catch (error) {
      res.status(500).json("Error de servicio");
    }
  };
  maestro_informe.getSelect = async (req, res) => {
    const { filter } = req.params;

    try {
      let result = await modelMaestro.findSelect(filter);

      if (result.errno) {
        res.status(500).json("Error de servidor");
      } else if (result.length >= 0) {
        res.status(200).json(result);
      }
    } catch (error) {
      res.status(500).json("Error de servicio");
    }
  };
  maestro_informe.getSelectTipo = async (req, res) => {
    const { filter, tipo } = req.params;

    try {
      let result = await modelMaestro.findSelectTipo(filter, tipo);

      if (result.errno) {
        res.status(500).json("Error de servidor");
      } else if (result.length >= 0) {
        res.status(200).json(result);
      }
    } catch (error) {
      res.status(500).json("Error de servicio");
    }
  };
  maestro_informe.getById = async (req, res) => {
    const { code } = req.params;
    console.log(code);
    try {
      let result = await modelMaestro.findById(code);

      if (result.errno) {
        res.status(500).json("Error de servidor");
      } else if (result.length > 0) {
        res.status(200).json(result.length > 0 ? result[0] : result);
      } else {
        res.status(404).send();
      }
    } catch (error) {
      res.status(500).json("Error de servicio");
    }
  };

  maestro_informe.DisableOrEnable = async (req, res) => {
    const data = req.body;
    console.log(data);
    try {
      if (!isUndefinedOrNull(data.status) && !isUndefinedOrNull(data.code)) {
        let result = await modelMaestro.disableOrEnable(data);
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
      res.status(500).json("Error de servicio");
    }
  };

  return maestro_informe;
};
