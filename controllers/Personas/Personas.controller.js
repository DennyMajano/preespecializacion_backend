const modelPersonas = require("../../models/Personas/Personas.model");
const isUndefinedOrNull = require("validate.io-undefined-or-null");
const Encrytion = require("../../services/encrytion/Encrytion");
module.exports = () => {
  let personas = {};

  personas.insertOne = async (req, res) => {
    const data = req.body;
    console.log(data);
    try {
      if (!isUndefinedOrNull(data.name)) {
        let result = await modelPersonas.create(data);
        if (result.errno) {
          res.status(500).json("Error de servidor");
        } else if (result.affectedRows === 1) {
          res.status(201).json({
            message: "Se creo con exito",
            id: result.insertId,
          });
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
  personas.updateOne = async (req, res) => {
    const data = req.body;
    console.log(data);
    try {
      if (!isUndefinedOrNull(data.code) && !isUndefinedOrNull(data.name)) {
        let result = await modelPersonas.update(data);
        if (result.errno) {
          console.log(result);
          res.status(500).json("Error de servidor");
        } else if (result.affectedRows === 1) {
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

  personas.getAll = async (req, res) => {
    const { filter } = req.params;
    console.log(filter);
    try {
      let result = await modelPersonas.findAll(filter);
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

  personas.getSelect = async (req, res) => {
    const { filter } = req.params;

    try {
      let result = await modelPersonas.findSelect(filter);

      if (result.code) {
        res.status(500).json({
          message: "Error servidor",
          erro_code: result.code,
        });
      } else if (result.length >= 0) {
        res.status(200).json(result);
      }
    } catch (error) {
      console.log(error);
    }
  };
  personas.getById = async (req, res) => {
    const { code } = req.params;
    console.log(code);
    try {
      let result = await modelPersonas.findById(code);

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

  personas.DisableOrEnable = async (req, res) => {
    const data = req.body;
    console.log(data);
    try {
      if (!isUndefinedOrNull(data.status) && !isUndefinedOrNull(data.code)) {
        let result = await modelPersonas.disableOrEnable(data);
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
  return personas;
};
