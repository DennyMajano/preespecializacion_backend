const database = require("../../config/database.async");
const db = require("../../config/conexion");
const encryption = require("../../services/encrytion/Encrytion");
const password_encryption = require("../../services/encrytion/PasswordEncryption");
const mail = require("../../services/email/Mail");
const GeneratePassword = require("../../helpers/GeneratePassword");
const NombreTrim = require("../../helpers/NombreTrim");
module.exports = {
  create: async (data, imagen) => {
    const { nombre, alias, rol, correo, user } = data;

    let usuario;

    let transaction;
    const password_generate = GeneratePassword();
    try {
      transaction = await database.Transaction(db, async () => {
        usuario = await db.query(
          `INSERT INTO usuarios(nombre_completo, nombre_sistema, rol, correo, user_name, avatar, password) VALUES (?,?,?,?,?,?,?)`,
          [
            nombre,
            alias,
            rol,
            correo,
            user,
            imagen,
            password_encryption.encrypt_password(password_generate),
          ]
        );

        //Aqui enviar el correo

        let info = await mail.send(
          "Bienvenido al SISTEMA",
          correo,
          "ASIGNACION DE CONTRASEÑA",
          `Bienvenido al sistema ${nombre} esta es tu contraseña: ${password_generate}`
        );

        console.log(info);
      });
    } catch (error) {
      return error;
    }

    return usuario !== undefined ? usuario : transaction;
  },

  update: async (data) => {
    const { nombre, alias, rol, correo, code } = data;
    let usuario;
    let transaction;

    try {
      transaction = await database.Transaction(db, async () => {
        usuario = await db.query(
          `UPDATE usuarios SET nombre_completo=?,nombre_sistema=?,rol=?,correo=? WHERE id=?`,
          [nombre, alias, rol, correo, code]
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

          let query = `SELECT U.id, U.nombre_completo, U.nombre_sistema, R.nombre AS rol, U.correo, U.user_name, U.condicion, U.bloqueo, U.motivo_bloqueo FROM usuarios U LEFT JOIN roles R ON U.rol=R.id WHERE `;

          for (let i = 0; i < filter.length; i++) {
            query += ` (U.nombre_completo LIKE '%${
              filter[i]
            }%' OR U.nombre_sistema LIKE '%${
              filter[i]
            }%' OR U.user_name LIKE '%${filter[i]}%' OR R.nombre LIKE '%${
              filter[i]
            }%') ${i + 1 - filter.length >= 0 ? "" : "AND"}`;
          }

          usuarios = await db.query(`${query}`);
        } else {
          usuarios = await db.query(
            `SELECT U.id, U.nombre_completo, U.nombre_sistema, R.nombre AS rol, U.correo, U.user_name, U.condicion, U.bloqueo, U.motivo_bloqueo FROM usuarios U LEFT JOIN roles R ON U.rol=R.id`
          );
        }
        if (!usuarios.errno) {
          data_usuarios = usuarios.map((element) => {
            return {
              id: element.id,

              rol: element.rol,

              user_name: element.user_name,
              nombre_sistema: element.nombre_sistema,
              nombre: NombreTrim(element.nombre_completo),
              condicion: element.condicion,
              bloqueo: element.bloqueo,
              correo: element.correo,
              m_bloqueo: element.motivo_bloqueo,
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
          `SELECT U.nombre_completo, U.nombre_sistema, U.correo, U.rol AS rol_id, R.nombre AS rol_name FROM usuarios U LEFT JOIN roles R ON U.rol=R.id WHERE U.id=?`,
          [code]
        );

        if (!usuario.errno) {
          data_usuarios = usuario.map((element) => {
            return {
              nombre: element.nombre_completo,
              alias: element.nombre_sistema,
              correo: element.correo,
              rol: { label: element.rol_name, value: element.rol_id },
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
  desactivarActivar: async (data) => {
    const { status, code } = data;
    let usuario;
    let transaction;

    try {
      transaction = await database.Transaction(db, async () => {
        usuario = await db.query(`UPDATE usuarios SET condicion=? WHERE id=?`, [
          status,
          code,
        ]);
      });
    } catch (error) {
      return error;
    }

    return usuario !== undefined ? usuario : transaction;
  },
  bloquearDesbloquear: async (data) => {
    const { bloqueo, code, motivo } = data;
    let usuario;
    let transaction;

    try {
      transaction = await database.Transaction(db, async () => {
        usuario = await db.query(
          `UPDATE usuarios SET bloqueo=?, motivo_bloqueo=? WHERE id=?`,
          [bloqueo, bloqueo === 1 ? motivo : null, code]
        );
      });
    } catch (error) {
      return error;
    }

    return usuario !== undefined ? usuario : transaction;
  },
};
