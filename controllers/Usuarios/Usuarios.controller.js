const modelUsuarios = require("../../models/Usuarios/Usuarios.model");
const modelAcceso = require("../../models/Acceso/Acceso.model");
const isUndefinedOrNull = require("validate.io-undefined-or-null");
const fs = require("fs-extra");
const Config = require("../../config.path");
const { token } = require("morgan");

module.exports = () => {
  let usuarios = {};

  usuarios.insertOne = async (req, res) => {
    const data = req.body;

    try {
      if (
        !isUndefinedOrNull(data.persona) &&
        !isUndefinedOrNull(data.iglesia) &&
        !isUndefinedOrNull(data.correo_electronico) &&
        !isUndefinedOrNull(data.rol) &&
        !isUndefinedOrNull(data.alias)
      ) {
        let result = await modelUsuarios.create(data);
        if (result.errno) {
          res.status(500).json("Error de servidor");

          // if (req.file) {
          //   fs.remove(`${Config.PATH_IMAGES}usuarios/${req.file.filename}`);
          // }
        } else if (result.affectedRows > 0) {
          res.status(201).json("Se creo con exito");
        } else {
          // if (req.file) {
          //   fs.remove(`${Config.PATH_IMAGES}usuarios/${req.file.filename}`);
          // }
          res.status(400).json("No se pudo crear");
        }
      } else {
        // if (req.file) {
        //   fs.remove(`${Config.PATH_IMAGES}usuarios/${req.file.filename}`);
        // }
        res.status(400).json("faltan datos para realizar el proceso");
      }
    } catch (error) {
      // if (req.file) {
      //   fs.remove(`${Config.PATH_IMAGES}usuarios/${req.file.filename}`);
      // }
      console.log(error);
    }
  };
  usuarios.updateOne = async (req, res) => {
    const data = req.body;

    try {
      if (
        !isUndefinedOrNull(data.iglesia) &&
        !isUndefinedOrNull(data.alias) &&
        !isUndefinedOrNull(data.correo_electronico) &&
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
  usuarios.getIglesiasUsuario = async (req, res) => {
    const { code } = req.params;
    console.log(code);
    try {
      let result = await modelUsuarios.getIglesiasUser(code);
      console.log(result);
      if (result.errno) {
        res.status(500).json("Error de servidor");
      } else if (result.length > 0) {
        res.status(200).json(result.length > 0 ? result : result);
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

  usuarios.validar_persona = async (req, res) => {
    const { valor } = req.params;

    try {
      let result = await modelUsuarios.validation_usuarios("persona", valor);
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
      let result = await modelUsuarios.validation_usuarios(
        "correo_electronico",
        valor
      );
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
  usuarios.BloquearDesbloquear = async (req, res) => {
    const data = req.body;

    try {
      if (!isUndefinedOrNull(data.code) && !isUndefinedOrNull(data.estado)) {
        let result = await modelUsuarios.bloquearDesbloquear(data);
        if (result.errno) {
          res.status(500).json("Error de servidor");
        } else if (result.affectedRows === 1) {
          res.status(200).json("Proceso se realizó con exito");
        } else if (result.affectedRows === 0) {
          res.status(404).json("No se pudo encontrar el usuario");
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

  usuarios.delete = async (req, res) => {
    const data = req.body;

    try {
      if (!isUndefinedOrNull(data.code)) {
        let result = await modelUsuarios.delete(data);
        if (result.errno) {
          res.status(500).json("Error de servidor");
        } else if (result.affectedRows === 1) {
          res.status(200).json("Proceso se realizó con exito");
        } else {
          console.log(result);
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
    let result;
    console.log(data);
    try {
      let type = parseInt(data.changeRequestType);
      if (
        !isUndefinedOrNull(data.email) &&
        !isNaN(parseInt(type)) &&
        (type == 1 || type == 3 || type == 2)
      ) {
        result = await modelUsuarios.requestEmailToChangePassword(data);
        console.log(result);

        if (result.errno) {
          throw result;
        } else {
          res.status(200).json({
            estado: result,
          });
        }
      } else {
        res.status(400).json("Faltan datos o son datos incorrectos");
      }
    } catch (error) {
      console.log(error);
      res.status(500).json("Error de servidor");
    }
  };

  usuarios.changePassword = async (req, res) => {
    const data = req.body;
    console.log("datos----------------------------");
    console.log(data);
    try {
      if (
        !isUndefinedOrNull(data.token) &&
        !isUndefinedOrNull(data.type) &&
        !isUndefinedOrNull(data.newPassword)
      ) {
        const isTokenValid = await modelAcceso.checkTokenToChangePassword(
          data.token
        );
        console.log("Token valido:" + isTokenValid);
        if (isTokenValid.estado === 1) {
          //Si el token es valido
          const changePasswordResult = await modelUsuarios.changePassword(data);
          console.log("Resultado de cambio de contraseña");
          console.log(changePasswordResult);
          //Se devolvio un booleano? que es el caso si las operaciones siguieron el curso normal
          if (typeof changePasswordResult === "boolean") {
            //Dependiendo si se cambio la contraseña o no se manda 201 (modificado) o 200 (Ejecutado pero no cambiado por que el codigo temporal incorrecto)
            res
              .status(changePasswordResult ? 201 : 200)
              .json({ estado: changePasswordResult });
          } else {
            throw changePasswordResult; // Error devuelto desde modelo
          }
        } else {
          res.status(403).json("Sin autorización"); // El token no es valido
        }
      } else {
        res.status(400).json("Solicitud mal formada"); //solicitud con datos incompletos
      }
    } catch (error) {
      console.log("FINAl");
      console.log(error);
      res.status(500).json("Error de servidor");
    }
  };
  return usuarios;
};
