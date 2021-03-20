const modelDistritos = require("../../models/Distritos/Distritos.model");
const isUndefinedOrNull = require("validate.io-undefined-or-null");

module.exports = () => {
  let distrito = {};

  distrito.insertOne = async (req, res) => {
    const data = req.body;
    try {
      if (!isUndefinedOrNull(data.nombre) && !isUndefinedOrNull(data.zona)) {
        let result = await modelDistritos.create(data);
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
  distrito.updateOne = async (req, res) => {
    const data = req.body;
    try {
      if (
        !isUndefinedOrNull(data.code) &&
        !isUndefinedOrNull(data.nombre) &&
        !isUndefinedOrNull(data.zona)
      ) {
        let result = await modelDistritos.update(data);
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

  distrito.getAll = async (req, res) => {
    const { filter } = req.params;

    try {
      let result = await modelDistritos.findAll(filter);
      if (result.errno) {
        res.status(500).json("Error de servidor");
      } else if (result.length >= 0) {
        res.status(200).json(result);
      }
    } catch (error) {
      res.status(500).json("Error de servicio");
    }
  };
  distrito.getSelect = async (req, res) => {
    const { filter, zona } = req.params;
    console.log(filter);
    try {
      let result = await modelDistritos.findSelect(filter, zona);
      if (result.errno) {
        res.status(500).json("Error de servidor");
      } else if (result.length >= 0) {
        res.status(200).json(result);
      }
    } catch (error) {
      res.status(500).json("Error de servicio");
    }
  };
  distrito.getById = async (req, res) => {
    const { code } = req.params;
    console.log(code);
    try {
      let result = await modelDistritos.findById(code);
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

  distrito.DisableOrEnable = async (req, res) => {
    const data = req.body;
    console.log(data);
    try {
      if (!isUndefinedOrNull(data.status) && !isUndefinedOrNull(data.code)) {
        let result = await modelDistritos.disableOrEnable(data);
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
  return distrito;
};
