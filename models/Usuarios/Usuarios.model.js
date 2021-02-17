const database = require("../../config/database.async");
const db = require("../../config/conexion");
const encryption = require("../../services/encrytion/Encrytion");
const password_encryption = require("../../services/encrytion/PasswordEncryption");
const mail = require("../../services/email/Mail");
const GeneratePassword = require("../../helpers/GeneratePassword");
const NombreTrim = require("../../helpers/NombreTrim");
const { PrismaClient } = require("@prisma/client");
const GenerateUID = require("../../helpers/UID");
const Datetime = require("../../services/Date/Datetime");

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
              `Bienvenido al sistema ${alias} esta es tu codigo de seguridad: ${password_generate} \n
            <a href='${process.env.URL_FRONTEND}validar_acceso/${uidChange}'>Enlace</a>`
            );
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
          `SELECT U.id, U.iglesia AS iglesia_codigo, I.id AS iglesia_id, I.nombre AS iglesia_nombre, U.correo_electronico,  U.rol AS rol_id, R.nombre AS rol_nombre, U.alias FROM usuarios U LEFT JOIN iglesias I ON U.iglesia=I.codigo LEFT JOIN roles R ON U.rol=R.id WHERE U.id=?`,
          [code]
        );

        if (!usuario.errno) {
          data_usuarios = usuario.map((element) => {
            return {
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
  requestEmailToChangePassword: async (data) => {
    const { correo, tipo } = data;

    const password_generate = GeneratePassword();

    try {
      const prisma = new PrismaClient();
      const userToChangeSendEmail = await prisma.usuarios.findFirst({
        where: {
          correo_electronico: correo,
        },
      });
      console.log(userToChangeSendEmail);
      if (userToChangeSendEmail) {
        let temp_password = GeneratePassword();
        console.log("temp_pass: " + temp_password);
        const uidChange = GenerateUID();
        console.log("uid: " + uidChange);
        expire = new Date();
        console.log(expire);
        expire.setMinutes(expire.getMinutes() + 10); //Arreglar hora
        console.log(expire);

        const updateUser = await prisma.usuarios.update({
          where: {
            id: userToChangeSendEmail.id,
          },
          data: {
            password_defecto: true,
            password: password_encryption.encrypt_password(temp_password),
            cambios_password: {
              create: {
                correo_electronico: userToChangeSendEmail.correo_electronico,
                token: uidChange,
                vencimiento: expire,
                tipo_cambio: parseInt(tipo),
              },
            },
          },
        });
        if (updateUser.id) {
          const mailSend = await mail.send(
            "Control de seguridad",
            correo,
            "Restablecimiento de contraseña",
            "",
            `Estimado su contraseña es: ${temp_password} \n
            <a href='http://localhost:9700/restaurar/${uidChange}'>Enlace</a>
            `
          );
          return mailSend ? true : false;
        } else {
          return false;
        }
      } else {
        return false;
      }
    } catch (error) {
      return error;
    }
  },
};
