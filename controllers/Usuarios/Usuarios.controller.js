const modelUsuarios = require("../../models/Usuarios/Usuarios.model");
const isUndefinedOrNull = require("validate.io-undefined-or-null");
const fs = require("fs-extra");
const Config = require("../../config.path");

module.exports = () => {
  let usuarios = {};

  usuarios.insertOne = async (req, res) => {
    const data = req.body;
    const imagen = req.file ? req.file.filename : `profile_default.png`;
    console.log(data);
    try {
      if (
        !isUndefinedOrNull(data.persona) &&
        !isUndefinedOrNull(data.iglesia) &&
        !isUndefinedOrNull(data.correo_electronico) &&
        !isUndefinedOrNull(data.rol) &&
        !isUndefinedOrNull(data.alias)
      ) {
        let result = await modelUsuarios.create(data, imagen);
        if (result.errno) {
          res.status(500).json("Error de servidor");

          if (req.file) {
            fs.remove(`${Config.PATH_IMAGES}usuarios/${req.file.filename}`);
          }
        } else if (result.affectedRows > 0) {
          res.status(201).json("Se creo con exito");
        } else {
          if (req.file) {
            fs.remove(`${Config.PATH_IMAGES}usuarios/${req.file.filename}`);
          }
          res.status(400).json("No se pudo crear");
        }
      } else {
        if (req.file) {
          fs.remove(`${Config.PATH_IMAGES}usuarios/${req.file.filename}`);
        }
        res.status(400).json("faltan datos para realizar el proceso");
      }
    } catch (error) {
      if (req.file) {
        fs.remove(`${Config.PATH_IMAGES}usuarios/${req.file.filename}`);
      }
      console.log(error);
    }
  };
  usuarios.updateOne = async (req, res) => {
    const data = req.body;

    try {
      if (
        !isUndefinedOrNull(data.nombre) &&
        !isUndefinedOrNull(data.alias) &&
        !isUndefinedOrNull(data.correo) &&
        !isUndefinedOrNull(data.rol) &&
        !isUndefinedOrNull(data.code)
      ) {
        let result = await modelUsuarios.update(data);
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
  usuarios.getById = async (req, res) => {
    const { code } = req.params;
    console.log(code);
    try {
      let result = await modelUsuarios.findById(code);
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
  usuarios.getAll = async (req, res) => {
    const { filter } = req.params;

    try {
      let result = await modelUsuarios.findAll(filter);
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

  usuarios.validar_user = async (req, res) => {
    const { valor } = req.params;

    try {
      let result = await modelUsuarios.validation_usuarios("user_name", valor);
      console.log(result);
      if (result.errno) {
        res.status(500).json("Error de servidor");
      } else if (result !== null) {
        res.status(200).json({ valor: result });
      }
    } catch (error) {
      console.log(error);
    }
  };

  usuarios.validar_correo = async (req, res) => {
    const { valor } = req.params;

    try {
      let result = await modelUsuarios.validation_usuarios("correo", valor);
      console.log(result);
      if (result.errno) {
        res.status(500).json("Error de servidor");
      } else if (result !== null) {
        res.status(200).json({ valor: result });
      }
    } catch (error) {
      console.log(error);
    }
  };
  usuarios.reset_pass = async (req, res) => {
    const data = req.body;
    const ip = req.headers["ipaddress"];

    try {
      if (!isUndefinedOrNull(data.code) && !isUndefinedOrNull(data.correo)) {
        let result = await modelUsuarios.reset_password(data, ip);
        console.log(result);
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

  usuarios.desactivarActivar = async (req, res) => {
    const data = req.body;

    try {
      if (!isUndefinedOrNull(data.code) && !isUndefinedOrNull(data.status)) {
        let result = await modelUsuarios.desactivarActivar(data);
        if (result.errno) {
          res.status(500).json("Error de servidor");
        } else if (result.affectedRows === 1) {
          res.status(200).json("Proceso se realizó con exito");
        } else {
          res.status(400).json("No se pudo realizar el proceso");
        }
      } else {
        res.status(400).json("faltan datos para realizar el proceso");
      }
    } catch (error) {
      console.log(error);
    }
  };
  usuarios.BloquearDesbloquear = async (req, res) => {
    const data = req.body;

    try {
      if (
        !isUndefinedOrNull(data.code) &&
        !isUndefinedOrNull(data.bloqueo) &&
        !isUndefinedOrNull(data.motivo)
      ) {
        let result = await modelUsuarios.bloquearDesbloquear(data);
        if (result.errno) {
          res.status(500).json("Error de servidor");
        } else if (result.affectedRows === 1) {
          res.status(200).json("Proceso se realizó con exito");
        } else {
          res.status(400).json("No se pudo realizar el proceso");
        }
      } else {
        res.status(400).json("faltan datos para realizar el proceso");
      }
    } catch (error) {
      console.log(error);
    }
  };
  usuarios.getImagen = async (req, res) => {
    const { code } = req.params;
    console.log(code);
    try {
      let result = await modelUsuarios.getImage(code);
      console.log(result);
      if (result.errno) {
        res.status(500).json("Error de servidor");
      } else if (result.length > 0) {
        res.status(200).sendFile(`${Config.PATH_IMAGES}usuarios/${result}`);
      }
    } catch (error) {
      console.log(error);
    }
  };
  usuarios.requestEmailToChangePassword = async (req, res) => {
    const data = req.body;

    try {
      if (!isUndefinedOrNull(data.correo)) {
        let result = await modelUsuarios.requestEmailToChangePassword(data);
        console.log(result);
        if (result.errno) {
          res.status(500).json("Error de servidor");
        } else if (result) {
          res.status(200).json("Se envió un correo electrónico a la dirección");
        } else{
          res.status(200).json("NO Se envió un correo electrónico a la dirección");
        }
      } else {
        res.status(400).json("faltan datos para realizar el proceso");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return usuarios;
};
