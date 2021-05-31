const modelZonas = require("../../models/Zonas/Zonas.model");
const isUndefinedOrNull = require("validate.io-undefined-or-null");

module.exports = () => {
  let zona = {};

  zona.insertOne = async (req, res) => {
    const data = req.body;
    console.log(data);
    try {
      if (!isUndefinedOrNull(data.nombre)) {
        let result = await modelZonas.create(data);
        if (result.errno) {
          res.status(500).json("Error de servidor");
        } else if (result.affectedRows > 0) {
          res
            .status(201)
            .json({ message: "Se creo con exito", zona: result.insertId });
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
  zona.updateOne = async (req, res) => {
    const data = req.body;

    try {
      if (!isUndefinedOrNull(data.code) && !isUndefinedOrNull(data.nombre)) {
        let result = await modelZonas.update(data);
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

  zona.getAll = async (req, res) => {
    const { filter } = req.params;

    try {
      let result = await modelZonas.findAll(filter);

      if (result.errno) {
        res.status(500).json("Error de servidor");
      } else if (result.length >= 0) {
        res.status(200).json(result);
      }
    } catch (error) {
      res.status(500).json("Error de servicio");
    }
  };
  zona.getSelect = async (req, res) => {
    const { filter } = req.params;
    console.log(filter);
    try {
      let result = await modelZonas.findSelect(filter);

      if (result.errno) {
        res.status(500).json("Error de servidor");
      } else if (result.length >= 0) {
        res.status(200).json(result);
      }
    } catch (error) {
      res.status(500).json("Error de servicio");
    }
  };
  zona.getById = async (req, res) => {
    const { code } = req.params;
    console.log(code);
    try {
      let result = await modelZonas.findById(code);

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

  zona.DisableOrEnable = async (req, res) => {
    const data = req.body;
    console.log(data);
    try {
      if (!isUndefinedOrNull(data.status) && !isUndefinedOrNull(data.code)) {
        let result = await modelZonas.disableOrEnable(data);
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
  return zona;
};
