const database = require("../../config/database.async");
const db = require("../../config/conexion");
const encryption = require("../../services/encrytion/Encrytion");
const password_encryption = require("../../services/encrytion/PasswordEncryption");
const mail = require("../../services/email/Mail");
const GeneratePassword = require("../../helpers/GeneratePassword");
const NombreTrim = require("../../helpers/NombreTrim");
const GenerateUID = require("../../helpers/UID");
const Datetime = require("../../services/Date/Datetime");
const { copySync } = require("fs-extra");
const isUndefinedOrNull = require("validate.io-undefined-or-null/lib");
const EmailTemplates = require("../../helpers/EmailTemplates");

module.exports = {
  create: async (data) => {
    const { persona, iglesia, correo_electronico, rol, alias } = data;

    let usuario;

    let transaction;
    const password_generate = GeneratePassword();
    const uidChange = GenerateUID();
    try {
      transaction = await database.Transaction(db, async () => {
        usuario = await db.query(
          `INSERT INTO usuarios(persona, iglesia, correo_electronico, password, rol, alias) VALUES (?,?,?,?,?,?)`,
          [
            persona,
            iglesia,
            correo_electronico,
            //aqui va password generate
            password_encryption.encrypt_password(password_generate),
            rol,
            alias,
          ]
        );

        if (!usuario.errno) {
          if (usuario.affectedRows) {
            await db.query(
              `INSERT INTO cambios_password(usuario, correo_electronico, token, vencimiento, tipo_cambio) VALUES (?,?,?,?,?)`,
              [
                usuario.insertId,
                correo_electronico,
                uidChange,
                Datetime.vencimiento_minutos(25),
                2,
              ]
            );

            //Aqui enviar el correo
            let info = mail.send(
              "Bienvenido al SISTEMA",
              correo_electronico,
              "ASIGNACION DE CONTRASEÑA",
              ``,
              EmailTemplates.WelcomeEmail(
                alias,
                password_generate,
                `${process.env.URL_FRONTEND}validar_acceso/${uidChange}`
              )
            );

            console.log(info);
          }
        }
      });
    } catch (error) {
      return error;
    }

    console.log(transaction);
    return usuario !== undefined ? usuario : transaction;
  },

  update: async (data) => {
    const { iglesia, correo_electronico, rol, alias, code } = data;
    let usuario;
    let transaction;

    try {
      transaction = await database.Transaction(db, async () => {
        usuario = await db.query(
          `UPDATE usuarios SET iglesia=?,correo_electronico=?,rol=?,alias=? WHERE id=?`,
          [iglesia, correo_electronico, rol, alias, code]
        );
      });
    } catch (error) {
      return error;
    }

    return usuario !== undefined ? usuario : transaction;
  },

  findAll: async (filter = "") => {
    let usuarios;
    let transaction;
    let data_usuarios;

    try {
      transaction = await database.Transaction(db, async () => {
        if (filter != "") {
          filter = filter.split(" ");

          let query = `SELECT U.id,P.codigo AS persona_codigo, CONCAT(P.nombres,' ',P.apellidos) AS nombre, I.nombre AS iglesia_nombre, U.correo_electronico, R.nombre AS rol_nombre, DATE_FORMAT(U.ultimo_login,'%d/%m/%Y %r') AS ultimo_login, DATE_FORMAT(U.fecha_cr,'%d/%m/%Y %r') AS fecha_registro, U.password_defecto, U.estado FROM usuarios U LEFT JOIN iglesias I ON U.iglesia=I.codigo LEFT JOIN roles R ON U.rol=R.id LEFT JOIN personas P ON U.persona= P.codigo WHERE `;

          for (let i = 0; i < filter.length; i++) {
            query += ` (P.nombres LIKE '%${filter[i]}%' OR P.apellidos LIKE '%${
              filter[i]
            }%' OR P.codigo LIKE '%${
              filter[i]
            }%' OR P.numero_documento LIKE '%${
              filter[i]
            }%' OR I.nombre LIKE '%${
              filter[i]
            }%' OR U.correo_electronico LIKE '%${filter[i]}%') ${
              i + 1 - filter.length >= 0 ? "" : "AND"
            }`;
          }

          usuarios = await db.query(`${query}`);
        } else {
          usuarios = await db.query(
            `SELECT U.id,P.codigo AS persona_codigo, CONCAT(P.nombres,' ',P.apellidos) AS nombre, I.nombre AS iglesia_nombre, U.correo_electronico, R.nombre AS rol_nombre, DATE_FORMAT(U.ultimo_login,'%d/%m/%Y %r') AS ultimo_login, DATE_FORMAT(U.fecha_cr,'%d/%m/%Y %r') AS fecha_registro, U.password_defecto, U.estado FROM usuarios U LEFT JOIN iglesias I ON U.iglesia=I.codigo LEFT JOIN roles R ON U.rol=R.id LEFT JOIN personas P ON U.persona= P.codigo ORDER BY U.fecha_cr DESC LIMIT 50`
          );
        }
        if (!usuarios.errno) {
          data_usuarios = usuarios.map((element) => {
            return {
              id: element.id,
              persona_codigo: element.persona_codigo,

              rol: element.rol_nombre,

              nombre: element.nombre,
              iglesia: element.iglesia_nombre,
              correo_electronico: element.correo_electronico,

              ultimo_login: element.ultimo_login,
              fecha_registro: element.fecha_registro,
              password_defecto: element.password_defecto,
              estado: element.estado,
            };
          });
        }
      });
    } catch (error) {
      return error;
    }

    return usuarios !== undefined
      ? !usuarios.errno
        ? data_usuarios
        : usuarios
      : transaction;
  },

  findById: async (code) => {
    let usuario;
    let transaction;
    let data_usuarios;
    try {
      transaction = await database.Transaction(db, async () => {
        usuario = await db.query(
          `SELECT U.id, U.persona AS persona_codigo,P.id AS persona_id,  CONCAT(P.nombres,' ',P.apellidos) AS nombre_persona, U.iglesia AS iglesia_codigo, I.id AS iglesia_id, I.nombre AS iglesia_nombre, U.correo_electronico,  U.rol AS rol_id, R.nombre AS rol_nombre, U.alias FROM usuarios U LEFT JOIN iglesias I ON U.iglesia=I.codigo LEFT JOIN personas P ON U.persona=P.codigo LEFT JOIN roles R ON U.rol=R.id WHERE U.id=? LIMIT 1`,
          [code]
        );

        if (!usuario.errno) {
          data_usuarios = usuario.map((element) => {
            return {
              persona:
                element.persona_id !== null
                  ? {
                      label: element.nombre_persona,
                      value: element.persona_id,
                      codigo: element.persona_codigo,
                    }
                  : "",
              iglesia:
                element.iglesia_id !== null
                  ? {
                      label: element.iglesia_nombre,
                      value: element.iglesia_id,
                      codigo: element.iglesia_codigo,
                    }
                  : "",
              alias: element.alias,
              correo_electronico: element.correo_electronico,
              rol:
                element.rol_id !== null
                  ? { label: element.rol_nombre, value: element.rol_id }
                  : "",
            };
          });
        }
      });
    } catch (error) {
      return error;
    }

    return usuario !== undefined
      ? !usuario.errno
        ? data_usuarios
        : usuario
      : transaction;
  },

  getIglesiasUser: async (code) => {
    let iglesia;
    let transaction;
    let data_iglesias;
    try {
      transaction = await database.Transaction(db, async () => {
        iglesia = await db.query(
          `SELECT I.id, I.codigo, I.nombre AS iglesia, CONCAT(P.nombres,' ',P.apellidos) AS pastor, D.nombre AS departamento, M.nombre AS municipio, C.nombre AS canton, Z.nombre AS zona, DIS.nombre AS distrito FROM administracion_iglesias AI LEFT JOIN iglesias I ON AI.iglesia=I.codigo LEFT JOIN nombramientos_pastorales NP ON NP.estado=2 AND NP.condicion=1 LEFT JOIN detalle_nombramientos_pastorales DNP ON NP.id= DNP.nombramiento AND DNP.iglesia=I.codigo LEFT JOIN pastores PS ON PS.codigo= DNP.pastor LEFT JOIN personas P ON PS.persona=P.codigo LEFT JOIN departamentos D ON D.id=I.departamento LEFT JOIN municipios M ON M.id = I.municipio LEFT JOIN cantones C ON C.id = I.canton LEFT JOIN zonas Z ON Z.codigo=I.zona LEFT JOIN distritos DIS ON DIS.codigo=I.distrito WHERE AI.persona=?`,
          [code]
        );

        if (!iglesia.errno) {
          data_iglesias = iglesia.map((element) => {
            return {
              id: element.id,
              codigo: element.codigo,
              iglesia: element.iglesia,
              pastor: element.pastor,
              departamento: element.departamento,
              municipio: element.municipio,
              canton: element.canton,
              zona: element.zona,
              distrito: element.distrito,
            };
          });
        }
      });
    } catch (error) {
      return error;
    }

    return iglesia !== undefined
      ? !iglesia.errno
        ? data_iglesias
        : iglesia
      : transaction;
  },
  getImage: async (usuario) => {
    let data;
    let transaction;
    let data_final;

    try {
      transaction = await database.Transaction(db, async () => {
        data = await db.query(`SELECT avatar FROM usuarios WHERE id=?`, [
          usuario,
        ]);

        if (!data.errno) {
          data_final = data[0].avatar;
        }
      });
    } catch (error) {
      return error;
    }
    console.log(transaction);
    return data !== undefined ? (!data.errno ? data_final : data) : transaction;
  },
  validation_usuarios: async (condicion, valor) => {
    let data;
    let transaction;
    let data_final;

    try {
      transaction = await database.Transaction(db, async () => {
        data = await db.query(
          `SELECT COUNT(*) AS numero FROM usuarios WHERE ${condicion}=?`,
          [valor]
        );

        if (!data.errno) {
          data_final = data[0].numero;
        } else {
          data_final = null;
        }
      });
    } catch (error) {
      return error;
    }
    console.log(transaction);
    return data !== undefined ? (!data.errno ? data_final : data) : transaction;
  },
  reset_password: async (data, ip) => {
    const { code, correo } = data;
    let usuario;
    let transaction;
    let nombre_completo;

    const password_generate = GeneratePassword();

    try {
      transaction = await database.Transaction(db, async () => {
        nombre_completo = await db.query(
          "SELECT nombre_completo FROM usuarios WHERE id=?",
          [code]
        );
        usuario = await db.query("UPDATE usuarios SET password=? WHERE id=?", [
          password_encryption.encrypt_password(password_generate),
          code,
        ]);

        let info = await mail.send(
          "Control de seguridad",
          correo,
          "Restablecimiento de contraseña",
          `Estimado ${nombre_completo[0].nombre_completo} su contraseña es: ${password_generate}`
        );
      });
    } catch (error) {
      return error;
    }

    return usuario !== undefined ? usuario : transaction;
  },

  bloquearDesbloquear: async (data) => {
    const { estado, code } = data;
    let usuario;
    let transaction;

    try {
      transaction = await database.Transaction(db, async () => {
        usuario = await db.query(`UPDATE usuarios SET estado=? WHERE id=?`, [
          estado,
          code,
        ]);
      });
    } catch (error) {
      return error;
    }
    console.log(usuario);

    return usuario !== undefined ? usuario : transaction;
  },
  delete: async (data) => {
    const { code } = data;
    let usuario;
    let log_pass;
    let transaction;

    try {
      transaction = await database.Transaction(db, async () => {
        log_pass = await db.query(
          `DELETE FROM cambios_password WHERE usuario=?`,
          [code]
        );
        usuario = await db.query(`DELETE FROM usuarios WHERE id=?`, [code]);
      });
    } catch (error) {
      return error;
    }

    return usuario !== undefined && log_pass !== undefined
      ? usuario
      : transaction;
  },
  requestEmailToChangePassword: async (changeRequestData) => {
    let result;
    try {
      let transactionResult;
      let userRegisteredRow;
      let updatedUser;
      let temporalPassword;
      const { email, changeRequestType } = changeRequestData;

      transactionResult = await database.Transaction(db, async () => {
        userRegisteredRow = await db.query(
          "SELECT `id`,`alias`,`correo_electronico` FROM `usuarios` WHERE `correo_electronico` = ? LIMIT 1",
          [email]
        );
        console.log("Usuario buscado-------------------------");
        console.log(userRegisteredRow);

        if (userRegisteredRow.length > 0) {
          const uidRequestToken = GenerateUID();

          if (changeRequestType == 3) {
            // Si el tipo de cambio es por admin resetear por defecto el pass
            temporalPassword = GeneratePassword();
            console.log("TEMP PASS" + temporalPassword);
            updatedUser = await db.query(
              "UPDATE `usuarios` SET `password`=?,`password_defecto`=? WHERE `id` = ?",
              [
                password_encryption.encrypt_password(temporalPassword),
                1,
                userRegisteredRow[0].id,
              ]
            );
          }

          console.log("Usuario actualizado-------------------------");
          console.log(updatedUser);
          if (changeRequestType == 1 || updatedUser.changedRows > 0) {
            let insertedChangeRequest = await db.query(
              "INSERT INTO cambios_password(usuario, correo_electronico, token, vencimiento, tipo_cambio) VALUES (?,?,?,?,?)",
              [
                userRegisteredRow[0].id,
                email,
                uidRequestToken,
                Datetime.vencimiento_minutos(10),
                parseInt(changeRequestType),
              ]
            );
            console.log("Cambio password insertado-------------------------");
            console.log(insertedChangeRequest);
            if (insertedChangeRequest.affectedRows > 0) {
              console.log(
                "MAIL enviado en teoria --------------------------------------"
              );
              let htmlForMail;
              if (changeRequestType == 1) {
                /* htmlForMail = "<p>Hola "+userRegisteredRow[0].alias+", para cambiar tu contraseña, ingresa al siguiente enlace: <a href='"+process.env.URL_FRONTEND+"validar_acceso/"+uidRequestToken+"'>Cambiar contraseña</a></p>"; */
                htmlForMail = EmailTemplates.UserChangePasswordEmail(
                  userRegisteredRow[0].alias,
                  process.env.URL_FRONTEND + "validar_acceso/" + uidRequestToken
                );
              } else {
                /* htmlForMail = "<p>Hola "+userRegisteredRow[0].alias+", para cambiar tu contraseña, este es tu codigo de seguridad: "+temporalPassword+"</p><p>Ingresa al siguiente enlace para cambiar la contraseña:  <a href='"+process.env.URL_FRONTEND+"validar_acceso/"+uidRequestToken+"'>Cambiar contraseña</a></p>"; */
                htmlForMail = EmailTemplates.AdministratorChangePasswordEmail(
                  userRegisteredRow[0].alias,
                  temporalPassword,
                  process.env.URL_FRONTEND + "validar_acceso/" + uidRequestToken
                );
              }
              let info = mail.send(
                "Administración de IDDPU El Salvador",
                email,
                "Recuperación de contraseña",
                "",
                htmlForMail
              );

              result = true;
            } else {
              console.log("cambios pasword no guardado");
              throw 500; // no se pudo guardar en cambios password
            }
          } else {
            //No se pudo actualizar la contraseña temporal en usuarios
            throw 500;
          }
        } else {
          result = false; //No se encontro el correo en los usuarios
        }
      });
      if (transactionResult.errno) {
        throw transactionResult;
      }

      return result;
    } catch (error) {
      console.log(error);
      return error;
    }
  },
  changePassword: async (changePasswordData) => {
    const { securityCode, type, newPassword, token } = changePasswordData;
    let result;
    try {
      const transactionResult = await database.Transaction(db, async () => {
        const userToChangePassword = await db.query(
          "SELECT usuarios.id as id , usuarios.password as password, cambios_password.tipo_cambio as tipo FROM cambios_password join usuarios on usuarios.id = cambios_password.usuario where token = ?",
          [token]
        );
        console.log("Usuario a cambiar-----------");
        console.log(userToChangePassword);
        if (
          userToChangePassword.length > 0 &&
          userToChangePassword[0].tipo == type
        ) {
          //Si se contro el usuario con ese token y si el tipo de cambio coincide con el recibido
          const userPasswordIsCorrect =
            type == 3 || type == 2
              ? password_encryption.validation_password(
                  securityCode,
                  userToChangePassword[0].password
                ) //Se valida la contraseña temporal si es por admin
              : true; //Si el cambio es solicitado desde login no se valida

          console.log("Codigo correcto: " + userPasswordIsCorrect);
          if (userPasswordIsCorrect) {
            // Si el codigo de seguridad es correcto
            const changePasswordResult = await db.query(
              "update usuarios set password = ?, password_defecto=? where id = ?",
              [
                password_encryption.encrypt_password(newPassword),
                0,
                userToChangePassword[0].id,
              ]
            );
            console.log("Cambio de contraseña--------------");
            console.log(changePasswordResult);
            if (changePasswordResult.changedRows > 0) {
              //Inhabilitar el token usado
              const updatedToken = await db.query(
                "update cambios_password set vigente = ?, utilizado = ?, fecha_utilizado=? where token = ? ",
                [0, 1, Datetime.getDateTime(), token]
              );
              if (updatedToken.changedRows > 0) {
                result = true;
              } else {
                throw new Error(
                  "No se actualizó el historial de cambio de contraseña"
                );
              }
            } else {
              // No se cambió la contraseña
              throw new Error(
                "Se encontró el codigo pero no se actualizó la contraseña"
              );
            }
          } else {
            //la contraseña temporal es incorrecta
            result = false;
          }
        } else {
          //No se encontro usuario con ese token...
          throw new Error(
            "Token no asociado con usuario o tipo de solicitud incorrecta"
          );
        }
      });

      if (transactionResult.errno || transactionResult instanceof Error) {
        throw transactionResult;
      }
      return result;
    } catch (error) {
      return error;
    }
  },
};
