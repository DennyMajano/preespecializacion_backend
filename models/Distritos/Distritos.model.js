const database = require("../../config/database.async");
const db = require("../../config/conexion");
const codeGenerator = require("../../helpers/GeneratorCode");
module.exports = {
  create: async (data) => {
    const { nombre, zona } = data;
    let distritos;
    let transaction;
    let codigo = codeGenerator("DTTO");
    try {
      transaction = await database.Transaction(db, async () => {
        distritos = await db.query(
          `INSERT INTO distritos(codigo, nombre, zona) VALUES (?,?,?)`,
          [codigo, nombre, zona]
        );
      });
    } catch (error) {
      return error;
    }

    return distritos !== undefined ? distritos : transaction;
  },

  update: async (data) => {
    const { code, nombre, zona } = data;
    let distritos;
    let transaction;

    try {
      transaction = await database.Transaction(db, async () => {
        distritos = await db.query(
          `UPDATE distritos SET nombre=?, zona=? WHERE id=?`,
          [nombre, zona, code]
        );
      });
    } catch (error) {
      return error;
    }

    return distritos !== undefined ? distritos : transaction;
  },

  findAll: async (filter = "") => {
    let data_out;
    let transaction;
    let data_data_out;

    try {
      transaction = await database.Transaction(db, async () => {
        if (filter != "") {
          filter = filter.split(" ");

          let query = `SELECT DTTO.id, DTTO.codigo,DTTO.nombre,Z.nombre AS zona, DTTO.condicion FROM distritos DTTO LEFT JOIN zonas Z ON DTTO.zona=Z.codigo WHERE `;

          for (let i = 0; i < filter.length; i++) {
            query += ` (DTTO.nombre LIKE '%${
              filter[i]
            }%' OR DTTO.codigo LIKE '%${filter[i]}%' OR Z.codigo LIKE '%${
              filter[i]
            }%' OR Z.nombre LIKE '%${filter[i]}%'   )  ${
              i + 1 - filter.length >= 0 ? "" : "AND"
            }`;
          }

          data_out = await db.query(`${query} LIMIT 100`);
        } else {
          data_out = await db.query(
            `SELECT DTTO.id, DTTO.codigo,DTTO.nombre,Z.nombre AS zona, DTTO.condicion FROM distritos DTTO LEFT JOIN zonas Z ON DTTO.zona=Z.codigo LIMIT 100`
          );
        }
        if (!data_out.errno) {
          data_data_out = data_out.map((element) => {
            return {
              id: element.id,
              codigo: element.codigo,
              nombre: element.nombre,
              zona: element.zona,
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
    let distritos;
    let transaction;
    let data_out;

    try {
      transaction = await database.Transaction(db, async () => {
        if (filter != "") {
          filter = filter.split(" ");

          let query = `SELECT id,codigo, nombre FROM distritos WHERE condicion=1 `;

          for (let i = 0; i < filter.length; i++) {
            query += ` AND (nombre LIKE '%${filter[i]}%')`;
          }

          distritos = await db.query(`${query} LIMIT 50`);
        } else {
          distritos = await db.query(
            `SELECT id,codigo, nombre FROM distritos WHERE condicion=1 LIMIT 50`
          );
        }
        if (!distritos.errno) {
          data_out = distritos.map((element) => {
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

    return distritos !== undefined
      ? !distritos.errno
        ? data_out
        : distritos
      : transaction;
  },
  findById: async (code) => {
    let distritos;
    let transaction;
    let data_out;
    try {
      transaction = await database.Transaction(db, async () => {
        distritos = await db.query(
          `SELECT DTTO.codigo,DTTO.nombre, Z.id AS zona_id, DTTO.zona AS zona_codigo, Z.nombre AS zona_nombre FROM distritos DTTO LEFT JOIN zonas Z ON DTTO.zona=Z.codigo WHERE DTTO.id=? OR DTTO.codigo=? LIMIT 1`,
          [code, code]
        );

        if (!distritos.errno) {
          data_out = distritos.map((element) => {
            return {
              codigo: element.codigo,
              nombre: element.nombre,
              zona: {
                label: element.zona_nombre,
                value: element.zona_id,
                codigo: element.zona_codigo,
              },
            };
          });
        }
      });
    } catch (error) {
      return error;
    }

    return distritos !== undefined
      ? !distritos.errno
        ? data_out
        : distritos
      : transaction;
  },
  disableOrEnable: async (data) => {
    const { status, code } = data;
    let distritos;
    let transaction;

    try {
      transaction = await database.Transaction(db, async () => {
        distritos = await db.query(
          `UPDATE distritos SET condicion=? WHERE id=?`,
          [status, code]
        );
      });
    } catch (error) {
      return error;
    }
    return distritos !== undefined ? distritos : transaction;
  },
};
