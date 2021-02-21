const database = require("../../config/database.async");
const db = require("../../config/conexion");
module.exports = {
  create: async (data) => {
    const { name } = data;
    let roles;
    let transaction;
    try {
      transaction = await database.Transaction(db, async () => {
        roles = await db.query(`INSERT INTO roles (nombre) VALUES (?)`, [name]);
      });
    } catch (error) {
      return error;
    }
    return roles !== undefined ? roles : transaction;
  },

  update: async (data) => {
    const { code, name } = data;
    let roles;
    let transaction;
    try {
      transaction = await database.Transaction(db, async () => {
        roles = await db.query(`UPDATE roles SET nombre=? WHERE id=?`, [
          name,
          code,
        ]);
      });
    } catch (error) {
      return error;
    }

    return roles !== undefined ? roles : transaction;
  },

  findAll: async (filter = "") => {
    let personas;
    let transaction;
    let data_roles;
    try {
      transaction = await database.Transaction(db, async () => {
        if (filter != "") {
          filter = filter.split(" ");

          let query = `SELECT id AS rol_id, nombre AS name, DATE_FORMAT(fecha_cr,"%W %d de %M del %Y, %I:%i %p") AS date,DATE_FORMAT(fecha_uac,"%W %d de %M del %Y, %I:%i %p") AS date_update, condicion AS status FROM roles WHERE`;

          for (let i = 0; i < filter.length; i++) {
            query += ` (nombre LIKE '%${filter[i]}%' OR id LIKE '%${
              filter[i]
            }%') ${i + 1 - filter.length >= 0 ? "" : "AND"}`;
          }
          console.log(query);
          personas = await db.query(`${query} ORDER BY nombre ASC LIMIT 100`);
        } else {
          personas = await db.query(
            `SELECT id AS rol_id, nombre AS name, DATE_FORMAT(fecha_cr,"%W %d de %M del %Y, %I:%i %p") AS date,DATE_FORMAT(fecha_uac,"%W %d de %M del %Y, %I:%i %p") AS date_update, condicion AS status FROM roles ORDER BY nombre ASC LIMIT 100`
          );
        }

        if (!personas.errno) {
          data_roles = roles.map((element) => {
            return {
              rol_id: element.rol_id,
              name: element.name,
              date: element.date,
              date_update: element.date_update,
              status: element.status,
            };
          });
        }
      });
    } catch (error) {
      return error;
    }

    return roles !== undefined
      ? !roles.errno
        ? data_roles
        : roles
      : transaction;
  },

  findSelect: async (filter = "") => {
    let personas;
    let transaction;
    let data_roles;
    try {
      transaction = await database.Transaction(db, async () => {
        if (filter != "") {
          filter = filter.split(" ");

          let query = `SELECT id, codigo, CONCAT( nombres,' ',apellidos) AS nombre FROM personas WHERE condicion=1 AND estado=1`;

          for (let i = 0; i < filter.length; i++) {
            query += ` AND (nombres LIKE '%${filter[i]}%' OR apellidos LIKE '%${filter[i]}%' OR codigo LIKE '%${filter[i]}%')`;
          }

          personas = personas = await db.query(
            `${query} ORDER BY nombre ASC LIMIT 50`
          );
        } else {
          personas = await db.query(
            `SELECT id, codigo, CONCAT( nombres,' ',apellidos) AS nombre FROM personas WHERE condicion=1 AND estado=1`
          );
        }

        if (!personas.code) {
          data_roles = personas.map((element) => {
            return {
              id: element.id,
              codigo: element.codigo,
              nombre: element.nombre,
            };
          });
        }
      });
    } catch (error) {
      return error;
    }

    return personas !== undefined
      ? personas.errno
        ? data_roles
        : personas
      : transaction;
  },

  findById: async (code) => {
    let roles;
    let data_roles;
    let transaction;
    try {
      transaction = await database.Transaction(db, async () => {
        roles = await db.query(
          `SELECT id AS rol_id, nombre AS name	FROM roles WHERE id=?`,
          [code]
        );

        if (!roles.errno) {
          data_roles = roles.map((element) => {
            return {
              rol_id: element.rol_id,
              name: element.name,
            };
          });
        }
      });
    } catch (error) {
      return error;
    }

    return roles !== undefined
      ? !roles.errno
        ? data_roles
        : roles
      : transaction;
  },

  disableOrEnable: async (data) => {
    const { status, code } = data;
    let modulo;
    let transaction;

    try {
      transaction = await database.Transaction(db, async () => {
        modulo = await db.query(`UPDATE roles SET condicion=? WHERE id=?`, [
          status,
          code,
        ]);
      });
    } catch (error) {
      return error;
    }

    return modulo !== undefined ? modulo : transaction;
  },
};
