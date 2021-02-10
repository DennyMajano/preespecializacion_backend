const modelAcceso = require("../../models/Acceso/Acceso.model");
const isUndefinedOrNull = require("validate.io-undefined-or-null");
const password_encryption = require(`../../services/encrytion/PasswordEncryption`);
const encryption = require("../../services/encrytion/Encrytion");
const Token = require("../../services/security/Token");

module.exports = () => {
  let acceso = {};
  acceso.login = async (req, res) => {
    const data = req.body;

    try {
      if (
        !isUndefinedOrNull(data.user_name) &&
        !isUndefinedOrNull(data.password)
      ) {
        let result = await modelAcceso.acceso(data);
        let token;
        let data_send;
        if (result.acceso.length > 0) {
          token = encryption.encrypt(
            String(
              Token.createToken({
                usuario: result.acceso[0].id,
                username: result.acceso[0].user_name,
                rol: result.acceso[0].rol,
                modulos: result.modulos.map((x) => {
                  return x.modulo;
                }),
              })
            )
          );
          data_send = {
            usuario: result.acceso[0].id,
            user_name: result.acceso[0].user_name,
            alias: result.acceso[0].nombre_sistema,
            correo: result.acceso[0].correo,
            modulos: result.modulos.map((x) => {
              return x.modulo;
            }),
            token: token,
            status: 1,
          };
        }
        console.log("RESULT", result);
        if (result.errno) {
          res.status(500).json("Error de servidor");
        } else {
          if (result.acceso.length > 0) {
            if (
              password_encryption.validation_password(
                data.password,
                result.acceso[0].password
              ) === true
            ) {
              res.status(200).json({
                message: "Se logueo con exito",
                acceso: data_send,
              });
            } else {
              res
                .status(401)
                .json({ mensaje: "Contraseña o usuario incorrecto" });
            }
          } else {
            res
              .status(401)
              .json({ mensaje: "Contraseña o usuario incorrecto" });
          }
        }
      } else {
        res.status(400).json("faltan datos para realizar el proceso");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return acceso;
};
