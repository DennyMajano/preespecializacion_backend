const database = require("../../config/database.async");
const db = require("../../config/conexion");
const UID = require("../../helpers/UID");
const encryption = require("../../services/encrytion/Encrytion");
module.exports = {
  create: async (data) => {
    const { name, principal, modulo_principal } = data;
    let modulo;
    let transaction;
    try {
      transaction = await database.Transaction(db, async () => {
        modulo = await db.query(
          `INSERT INTO modulos	(identificador,nombre,nivel_principal,es_principal) VALUES (?,?,?,?)`,
          [
            UID(),
            name,
            principal !== 0 ? principal : 0,
            modulo_principal ? modulo_principal : 0,
          ]
        );
      });
    } catch (error) {
      return error;
    }
    return modulo !== undefined ? modulo : transaction;
  },

  update: async (data) => {
    const { code, name, principal, modulo_principal } = data;

    let modulo;
    let transaction;

    try {
      transaction = await database.Transaction(db, async () => {
        modulo = await db.query(
          `UPDATE modulos SET nombre=?, nivel_principal=?, es_principal=? WHERE id=?`,
          [name, principal !== 0 ? principal : 0, modulo_principal, code]
        );
      });
    } catch (error) {
      return error;
    }
    console.log(transaction);
    return modulo !== undefined ? modulo : transaction;
  },

  findAll: async (filter = "") => {
    let modulo;
    let transaction;
    let data_modulos;
    try {
      transaction = await database.Transaction(db, async () => {
        if (filter != "") {
          filter = filter.split(" ");
          let query = `SELECT m.id AS modulo_id, m.identificador AS code, m.nombre AS name, m.fecha_cr AS date,md.nombre as padre, m.es_principal, m.condicion AS status FROM modulos m LEFT JOIN modulos md ON m.nivel_principal=md.id WHERE`;

          for (let i = 0; i < filter.length; i++) {
            query += `  (m.nombre LIKE '%${filter[i]}%' OR md.nombre LIKE '%${
              filter[i]
            }%') ${i + 1 - filter.length >= 0 ? "" : "AND"}`;
          }
          modulo = await db.query(`${query} ORDER BY m.nombre ASC LIMIT 100`);
        } else {
          modulo = await db.query(
            `SELECT m.id AS modulo_id, m.identificador AS code, m.nombre AS name, m.fecha_cr AS date,md.nombre as padre,m.es_principal, m.condicion AS status FROM modulos m LEFT JOIN modulos md ON m.nivel_principal=md.id ORDER BY m.nombre ASC LIMIT 100`
          );
        }

        if (!modulo.errno) {
          data_modulos = modulo.map((element) => {
            return {
              modulo_id: element.modulo_id,
              code: element.code,
              name: element.name,
              date: element.date,
              padre: element.padre,
              is_principal: element.es_principal,
              status: element.status,
            };
          });
        }
      });
    } catch (error) {
      return error;
    }

    return modulo !== undefined
      ? !modulo.errno
        ? data_modulos
        : modulo
      : transaction;
  },

  findSelect: async (filter = "") => {
    let modulo;
    let transaction;
    let data_modulos;
    try {
      transaction = await database.Transaction(db, async () => {
        if (filter != "") {
          filter = filter.split(" ");

          let query = `SELECT id AS modulo_id, nombre AS name FROM modulos WHERE es_principal=1 AND condicion=1`;

          for (let i = 0; i < filter.length; i++) {
            query += ` AND (nombre LIKE '%${filter[i]}%')`;
          }

          modulo = await db.query(`${query}  ORDER BY nombre ASC LIMIT 100`);
        } else {
          modulo = await db.query(
            `SELECT id AS modulo_id, nombre AS name FROM modulos WHERE es_principal=1 AND condicion=1 ORDER BY nombre ASC LIMIT 100`
          );
        }
        if (!modulo.errno) {
          data_modulos = modulo.map((element) => {
            return {
              modulo_id: element.modulo_id,
              name: element.name,
            };
          });
        }
      });
    } catch (error) {
      return error;
    }

    return modulo !== undefined
      ? !modulo.errno
        ? data_modulos
        : modulo
      : transaction;
  },
  findbypadre: async (id_padre) => {
    let modulo;
    let transaction;
    let data_modulos;
    try {
      transaction = await database.Transaction(db, async () => {
        modulo = await db.query(
          `SELECT id AS modulo_id, nombre AS name,fecha_cr AS fechacr FROM modulos WHERE nivel_principal=? ORDER BY nombre ASC LIMIT 100`,
          [id_padre]
        );

        if (!modulo.errno) {
          data_modulos = modulo.map((element) => {
            return {
              modulo_id: element.modulo_id,
              name: element.name,
              fechacr: element.fechacr,
            };
          });
        }
      });
    } catch (error) {
      return error;
    }

    return modulo !== undefined
      ? !modulo.errno
        ? data_modulos
        : modulo
      : transaction;
  },
  findById: async (code) => {
    let modulo;
    let transaction;
    let data_modulos;
    try {
      transaction = await database.Transaction(db, async () => {
        modulo = await db.query(
          `SELECT m.id AS modulo_id, m.nombre AS name, md.id AS padre_id, md.nombre AS padre_name,m.es_principal FROM modulos m LEFT JOIN modulos md ON m.nivel_principal=md.id WHERE m.id=?`,
          [code]
        );

        if (!modulo.errno) {
          data_modulos = modulo.map((element) => {
            return {
              modulo_id: element.modulo_id,
              name: element.name,
              padre_id: element.padre_id,
              padre_name: element.padre_name,
              is_principal: element.es_principal,
            };
          });
        }
      });
    } catch (error) {
      return error;
    }

    return modulo !== undefined
      ? !modulo.errno
        ? data_modulos
        : modulo
      : transaction;
  },

  disableOrEnable: async (data) => {
    const { status, code } = data;
    let modulo;
    let transaction;

    try {
      transaction = await database.Transaction(db, async () => {
        modulo = await db.query(`UPDATE modulos	SET condicion=? WHERE id=?`, [
          status,
          code,
        ]);
      });
    } catch (error) {
      return error;
    }
    console.log(transaction);
    return modulo !== undefined ? modulo : transaction;
  },
};
