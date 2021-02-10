const modelTipoDocumento = require("../../models/TipoDocumento/TipoDocumento.model");
const isUndefinedOrNull = require("validate.io-undefined-or-null");

module.exports = () => {
  let tipos_documento = {};

  tipos_documento.insertOne = async (req, res) => {
    const data = req.body;
    console.log(data);
    try {
      if (!isUndefinedOrNull(data.nombre)) {
        let result = await modelTipoDocumento.create(data);
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
      console.log(error);
    }
  };
  tipos_documento.updateOne = async (req, res) => {
    const data = req.body;

    try {
      if (!isUndefinedOrNull(data.code) && !isUndefinedOrNull(data.nombre)) {
        let result = await modelTipoDocumento.update(data);
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
      console.log(error);
    }
  };

  tipos_documento.getAll = async (req, res) => {
    const { filter } = req.params;

    try {
      let result = await modelTipoDocumento.findAll(filter);
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
  tipos_documento.getSelect = async (req, res) => {
    const { filter } = req.params;
    console.log(filter);
    try {
      let result = await modelTipoDocumento.findSelect(filter);
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
  tipos_documento.getById = async (req, res) => {
    const { code } = req.params;
    console.log(code);
    try {
      let result = await modelTipoDocumento.findById(code);
      console.log(result);
      if (result.errno) {
        res.status(500).json("Error de servidor");
      } else if (result.length > 0) {
        res.status(200).json(result.length > 0 ? result[0] : result);
      } else {
        res.status(404).send();
      }
    } catch (error) {
      console.log(error);
    }
  };

  tipos_documento.DisableOrEnable = async (req, res) => {
    const data = req.body;
    console.log(data);
    try {
      if (!isUndefinedOrNull(data.status) && !isUndefinedOrNull(data.code)) {
        let result = await modelTipoDocumento.disableOrEnable(data);
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
  return tipos_documento;
};
