const modelRoles = require("../../models/Roles/Roles.model");
const isUndefinedOrNull = require("validate.io-undefined-or-null");
const Encrytion = require("../../services/encrytion/Encrytion");
module.exports = () => {
  let rol = {};

  rol.insertOne = async (req, res) => {
    const data = req.body;
    console.log(data);
    try {
      if (!isUndefinedOrNull(data.name)) {
        let result = await modelRoles.create(data);
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
  rol.updateOne = async (req, res) => {
    const data = req.body;
    console.log(data);
    try {
      if (!isUndefinedOrNull(data.code) && !isUndefinedOrNull(data.name)) {
        let result = await modelRoles.update(data);
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

  rol.getAll = async (req, res) => {
    const { filter } = req.params;
    console.log(filter);
    try {
      let result = await modelRoles.findAll(filter);
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

  rol.getSelect = async (req, res) => {
    const { filter } = req.params;
    console.log(filter);
    try {
      let result = await modelRoles.findSelect(filter);
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
  rol.getById = async (req, res) => {
    const { code } = req.params;
    console.log(code);
    try {
      let result = await modelRoles.findById(code);

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

  rol.DisableOrEnable = async (req, res) => {
    const data = req.body;
    console.log(data);
    try {
      if (!isUndefinedOrNull(data.status) && !isUndefinedOrNull(data.code)) {
        let result = await modelRoles.disableOrEnable(data);
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
  return rol;
};
