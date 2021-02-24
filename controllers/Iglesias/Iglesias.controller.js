const modelIglesias = require("../../models/Iglesias/Iglesias.model");
const isUndefinedOrNull = require("validate.io-undefined-or-null");

module.exports = () => {
  let iglesia = {};

  iglesia.insertOne = async (req, res) => {
    const data = req.body;
    console.log(data);
    try {
      if (
        !isUndefinedOrNull(data.nombre) &&
        !isUndefinedOrNull(data.departamento) &&
        !isUndefinedOrNull(data.municipio) &&
        !isUndefinedOrNull(data.distrito) &&
        !isUndefinedOrNull(data.tipo_iglesia) &&
        !isUndefinedOrNull(data.zona)
      ) {
        let result = await modelIglesias.create(data);
        console.log(result);
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
  iglesia.updateOne = async (req, res) => {
    const data = req.body;

    try {
      if (!isUndefinedOrNull(data.code) && !isUndefinedOrNull(data.nombre)) {
        let result = await modelIglesias.update(data);
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

  iglesia.getAll = async (req, res) => {
    const { filter } = req.params;

    try {
      let result = await modelIglesias.findAll(filter);
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
  iglesia.getSelect = async (req, res) => {
    const { filter } = req.params;
    console.log(filter);
    try {
      let result = await modelIglesias.findSelect(filter);
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
  iglesia.getById = async (req, res) => {
    const { code } = req.params;
    console.log(code);
    try {
      let result = await modelIglesias.findById(code);
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

  iglesia.DisableOrEnable = async (req, res) => {
    const data = req.body;
    console.log(data);
    try {
      if (!isUndefinedOrNull(data.status) && !isUndefinedOrNull(data.code)) {
        let result = await modelIglesias.disableOrEnable(data);
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
  return iglesia;
};
