const modelModulos = require("../../models/Modulos/Modulos.model");
const isUndefinedOrNull = require("validate.io-undefined-or-null");
module.exports = () => {
  let modulo = {};

  modulo.insertOne = async (req, res) => {
    const data = req.body;
    console.log(data);
    try {
      if (
        !isUndefinedOrNull(data.name) &&
        !isUndefinedOrNull(data.principal) &&
        !isUndefinedOrNull(data.modulo_principal)
      ) {
        let result = await modelModulos.create(data);
        if (result.errno) {
          res.status(500).json("Error de servidor");
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
  modulo.updateOne = async (req, res) => {
    const data = req.body;
    console.log(data);
    try {
      if (
        !isUndefinedOrNull(data.code) &&
        !isUndefinedOrNull(data.name) &&
        !isUndefinedOrNull(data.principal) &&
        !isUndefinedOrNull(data.modulo_principal)
      ) {
        let result = await modelModulos.update(data);
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

  modulo.getAll = async (req, res) => {
    const { filter } = req.params;
    console.log(filter);
    try {
      let result = await modelModulos.findAll(filter);
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
  modulo.getbypadre = async (req, res) => {
    const { id_padre } = req.params;
    console.log(id_padre);
    try {
      let result = await modelModulos.findbypadre(id_padre);
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
  modulo.getSelect = async (req, res) => {
    const { filter } = req.params;
    console.log(filter);
    try {
      let result = await modelModulos.findSelect(filter);
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
  modulo.getById = async (req, res) => {
    const { code } = req.params;
    console.log(code);
    try {
      let result = await modelModulos.findById(code);
      console.log(result);
      if (result.errno) {
        res.status(500).json("Error de servidor");
      } else if (result.length > 0) {
        res.status(200).json(result.length > 0 ? result[0] : result);
      }else{
        res.status(404).send()
      }
    } catch (error) {
      console.log(error);
    }
  };

  modulo.DisableOrEnable = async (req, res) => {
    const data = req.body;
    console.log(data);
    try {
      if (!isUndefinedOrNull(data.status) && !isUndefinedOrNull(data.code)) {
        let result = await modelModulos.disableOrEnable(data);
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
  return modulo;
};
