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
    let roles;
    let transaction;
    let data_roles;
    try {
      transaction = await database.Transaction(db, async () => {
        if (filter != "") {
          filter = filter.split(" ");

          let query = `SELECT id AS rol_id, nombre AS name, DATE_FORMAT(create_time,"%W %d de %M del %Y, %I:%i %p") AS date,DATE_FORMAT(update_time,"%W %d de %M del %Y, %I:%i %p") AS date_update, condicion AS status FROM roles WHERE`;

          for (let i = 0; i < filter.length; i++) {
            query += ` (nombre LIKE '%${filter[i]}%' OR id LIKE '%${
              filter[i]
            }%') ${i + 1 - filter.length >= 0 ? "" : "AND"}`;
          }
          console.log(query);
          roles = await db.query(`${query} ORDER BY nombre ASC LIMIT 100`);
        } else {
          roles = await db.query(
            `SELECT id AS rol_id, nombre AS name, DATE_FORMAT(create_time,"%W %d de %M del %Y, %I:%i %p") AS date,DATE_FORMAT(update_time,"%W %d de %M del %Y, %I:%i %p") AS date_update, condicion AS status FROM roles ORDER BY nombre ASC LIMIT 100`
          );
        }

        if (!roles.errno) {
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
    let roles;
    let transaction;
    let data_roles;
    try {
      transaction = await database.Transaction(db, async () => {
        if (filter != "") {
          filter = filter.split(" ");

          let query = `SELECT id AS rol_id, nombre AS name FROM roles WHERE condicion=1`;

          for (let i = 0; i < filter.length; i++) {
            query += ` AND (nombre LIKE '%${filter[i]}%' OR id LIKE '%${filter[i]}%')`;
          }

          roles = await db.query(`${query}  ORDER BY nombre ASC LIMIT 100`);
        } else {
          roles = await db.query(
            `SELECT id AS rol_id, nombre AS name FROM roles WHERE condicion=1  ORDER BY nombre ASC LIMIT 100`
          );
        }
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
