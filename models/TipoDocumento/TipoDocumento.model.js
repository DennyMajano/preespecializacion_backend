const database = require("../../config/database.async");
const db = require("../../config/conexion");

module.exports = {
  create: async (data) => {
    const { nombre } = data;
    let tipo_documento;
    let transaction;
    try {
      transaction = await database.Transaction(db, async () => {
        tipo_documento = await db.query(
          `INSERT INTO tipo_documento(nombre) VALUES (?)`,
          [nombre]
        );
      });
    } catch (error) {
      return error;
    }

    return tipo_documento !== undefined ? tipo_documento : transaction;
  },

  update: async (data) => {
    const { code, nombre } = data;
    let tipo_documento;
    let transaction;

    try {
      transaction = await database.Transaction(db, async () => {
        tipo_documento = await db.query(
          `UPDATE tipo_documento SET nombre=? WHERE id=?`,
          [nombre, code]
        );
      });
    } catch (error) {
      return error;
    }

    return tipo_documento !== undefined ? tipo_documento : transaction;
  },

  findAll: async (filter = "") => {
    let data_out;
    let transaction;
    let data_data_out;

    try {
      transaction = await database.Transaction(db, async () => {
        if (filter != "") {
          filter = filter.split(" ");

          let query = `SELECT id, nombre, condicion FROM tipo_documento WHERE `;

          for (let i = 0; i < filter.length; i++) {
            query += ` (nombre LIKE '%${filter[i]}%')  ${
              i + 1 - filter.length >= 0 ? "" : "AND"
            }`;
          }

          data_out = await db.query(`${query}`);
        } else {
          data_out = await db.query(
            `SELECT id, nombre, condicion FROM tipo_documento`
          );
        }
        if (!data_out.errno) {
          data_data_out = data_out.map((element) => {
            return {
              id: element.id,
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
    let tipo_documento;
    let transaction;
    let data_out;

    try {
      transaction = await database.Transaction(db, async () => {
        if (filter != "") {
          filter = filter.split(" ");

          let query = `SELECT id, nombre FROM tipo_documento WHERE condicion=1`;

          for (let i = 0; i < filter.length; i++) {
            query += ` AND (nombre LIKE '%${filter[i]}%')`;
          }

          tipo_documento = await db.query(`${query}`);
        } else {
          tipo_documento = await db.query(
            `SELECT id, nombre FROM tipo_documento WHERE condicion=1`
          );
        }
        if (!tipo_documento.errno) {
          data_out = tipo_documento.map((element) => {
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

    return tipo_documento !== undefined
      ? !tipo_documento.errno
        ? data_out
        : tipo_documento
      : transaction;
  },
  findById: async (code) => {
    let tipo_documento;
    let transaction;
    let data_out;
    try {
      transaction = await database.Transaction(db, async () => {
        tipo_documento = await db.query(
          `SELECT nombre FROM tipo_documento WHERE id=?`,
          [code]
        );

        if (!tipo_documento.errno) {
          data_out = tipo_documento.map((element) => {
            return {
              nombre: element.nombre,
            };
          });
        }
      });
    } catch (error) {
      return error;
    }

    return tipo_documento !== undefined
      ? !tipo_documento.errno
        ? data_out
        : tipo_documento
      : transaction;
  },
  disableOrEnable: async (data) => {
    const { status, code } = data;
    let tipo_documento;
    let transaction;

    try {
      transaction = await database.Transaction(db, async () => {
        tipo_documento = await db.query(
          `UPDATE tipo_documento SET condicion=? WHERE id=?`,
          [status, code]
        );
      });
    } catch (error) {
      return error;
    }
    return tipo_documento !== undefined ? tipo_documento : transaction;
  },
};
