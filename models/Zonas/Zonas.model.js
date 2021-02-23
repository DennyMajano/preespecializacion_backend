const database = require("../../config/database.async");
const db = require("../../config/conexion");
const codeGenerator = require("../../helpers/GeneratorCode");
module.exports = {
  create: async (data) => {
    const { nombre } = data;
    let zonas;
    let transaction;
    let codigo = codeGenerator("ZN");
    try {
      transaction = await database.Transaction(db, async () => {
        zonas = await db.query(
          `INSERT INTO zonas(codigo, nombre) VALUES (?,?)`,
          [codigo, nombre]
        );
      });
    } catch (error) {
      return error;
    }

    return zonas !== undefined ? zonas : transaction;
  },

  update: async (data) => {
    const { code, nombre } = data;
    let zonas;
    let transaction;

    try {
      transaction = await database.Transaction(db, async () => {
        zonas = await db.query(`UPDATE zonas SET nombre=? WHERE id=?`, [
          nombre,
          code,
        ]);
      });
    } catch (error) {
      return error;
    }

    return zonas !== undefined ? zonas : transaction;
  },

  findAll: async (filter = "") => {
    let data_out;
    let transaction;
    let data_data_out;

    try {
      transaction = await database.Transaction(db, async () => {
        if (filter != "") {
          filter = filter.split(" ");

          let query = `SELECT id,codigo, nombre, condicion FROM zonas WHERE `;

          for (let i = 0; i < filter.length; i++) {
            query += ` (nombre LIKE '%${filter[i]}%' OR codigo LIKE '%${
              filter[i]
            }%' )  ${i + 1 - filter.length >= 0 ? "" : "AND"}`;
          }

          data_out = await db.query(`${query} LIMIT 100`);
        } else {
          data_out = await db.query(
            `SELECT id, codigo,nombre, condicion FROM zonas LIMIT 100`
          );
        }
        if (!data_out.errno) {
          data_data_out = data_out.map((element) => {
            return {
              id: element.id,
              codigo: element.codigo,
              nombre: element.nombre,
              condicion: element.condicion,
            };
          });
        }
      });
    } catch (error) {
      return error;
    }

    return data_out !== undefined
      ? !data_out.errno
        ? data_data_out
        : data_out
      : transaction;
  },
  findSelect: async (filter = "") => {
    let zonas;
    let transaction;
    let data_out;

    try {
      transaction = await database.Transaction(db, async () => {
        if (filter != "") {
          filter = filter.split(" ");

          let query = `SELECT id, nombre FROM zonas WHERE condicion=1 `;

          for (let i = 0; i < filter.length; i++) {
            query += ` AND (nombre LIKE '%${filter[i]}%')`;
          }

          zonas = await db.query(`${query} LIMIT 50`);
        } else {
          zonas = await db.query(
            `SELECT id, nombre FROM zonas WHERE condicion=1 LIMIT 50`
          );
        }
        if (!zonas.errno) {
          data_out = zonas.map((element) => {
            return {
              id: element.id,
              nombre: element.nombre,
            };
          });
        }
      });
    } catch (error) {
      return error;
    }

    return zonas !== undefined
      ? !zonas.errno
        ? data_out
        : zonas
      : transaction;
  },
  findById: async (code) => {
    let zonas;
    let transaction;
    let data_out;
    try {
      transaction = await database.Transaction(db, async () => {
        zonas = await db.query(
          `SELECT codigo,nombre FROM zonas WHERE id=? OR codigo=? LIMIT 1`,
          [code, code]
        );

        if (!zonas.errno) {
          data_out = zonas.map((element) => {
            return {
              codigo: element.codigo,
              nombre: element.nombre,
            };
          });
        }
      });
    } catch (error) {
      return error;
    }

    return zonas !== undefined
      ? !zonas.errno
        ? data_out
        : zonas
      : transaction;
  },
  disableOrEnable: async (data) => {
    const { status, code } = data;
    let zonas;
    let transaction;

    try {
      transaction = await database.Transaction(db, async () => {
        zonas = await db.query(`UPDATE zonas SET condicion=? WHERE id=?`, [
          status,
          code,
        ]);
      });
    } catch (error) {
      return error;
    }
    return zonas !== undefined ? zonas : transaction;
  },
};
