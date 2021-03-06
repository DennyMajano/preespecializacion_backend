const modelNivelPastor = require("../../models/NivelPastor/NivelPastor.model");
const isUndefinedOrNull = require("validate.io-undefined-or-null");

module.exports = () => {
  let nivel_pastor = {};

  nivel_pastor.insertOne = async (req, res) => {
    const data = req.body;

    try {
      if (
        !isUndefinedOrNull(data.nombre) &&
        !isUndefinedOrNull(data.descripcion)
      ) {
        let result = await modelNivelPastor.create(data);
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

  nivel_pastor.updateOne = async (req, res) => {
    const data = req.body;
    try {
      if (
        !isUndefinedOrNull(data.code) &&
        !isUndefinedOrNull(data.nombre) &&
        !isUndefinedOrNull(data.descripcion)
      ) {
        let result = await modelNivelPastor.update(data);
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

  nivel_pastor.getAll = async (req, res) => {
    const { filter } = req.params;
    try {
      let result = await modelNivelPastor.findAll(filter);

      if (result.errno) {
        res.status(500).json("Error de servidor");
      } else if (result.length >= 0) {
        res.status(200).json(result);
      }
    } catch (error) {
      res.status(500).json("Error de servicio");
    }
  };

  nivel_pastor.getSelect = async (req, res) => {
    const { filter } = req.params;

    try {
      let result = await modelNivelPastor.findSelect(filter);

      if (result.errno) {
        res.status(500).json("Error de servidor");
      } else if (result.length >= 0) {
        res.status(200).json(result);
      }
    } catch (error) {
      res.status(500).json("Error de servicio");
    }
  };
  nivel_pastor.getById = async (req, res) => {
    const { code } = req.params;
    try {
      let result = await modelNivelPastor.findById(code);

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

  nivel_pastor.DisableOrEnable = async (req, res) => {
    const data = req.body;

    try {
      if (!isUndefinedOrNull(data.status) && !isUndefinedOrNull(data.code)) {
        let result = await modelNivelPastor.disableOrEnable(data);
        if (result.errno) {
          res.status(500).json("Error de servidor");
        } else if (result.affectedRows === 1) {
          res.status(200).json("Proceso se realiz?? con exito");
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

  return nivel_pastor;
};
