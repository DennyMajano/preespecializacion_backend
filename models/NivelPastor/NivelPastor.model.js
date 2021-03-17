const database = require("../../config/database.async");
const db = require("../../config/conexion");
module.exports = {
  create: async (data) => {
    const { nombre, descripcion } = data;
    let nivel_pastor;
    let transaction;
    try {
      transaction = await database.Transaction(db, async () => {
        nivel_pastor = await db.query(
          `INSERT INTO nivel_pastor(nombre,descripcion) VALUES (?,?)`,
          [nombre, descripcion]
        );
      });
    } catch (error) {
      return error;
    }
    console.log(transaction);
    return nivel_pastor !== undefined ? nivel_pastor : transaction;
  },

  update: async (data) => {
    const { code, nombre, descripcion } = data;
    let nivel_pastor;
    let transaction;
    try {
      transaction = await database.Transaction(db, async () => {
        nivel_pastor = await db.query(
          `UPDATE nivel_pastor SET nombre=?, descripcion=? WHERE id=?`,
          [nombre, descripcion, code]
        );
      });
    } catch (error) {
      return error;
    }

    return nivel_pastor !== undefined ? nivel_pastor : transaction;
  },

  findAll: async (filter = "") => {
    let data_out;
    let transaction;
    let data_data_out;

    try {
      transaction = await database.Transaction(db, async () => {
        if (filter != "") {
          filter = filter.split(" ");

          let query = `SELECT id, nombre, descripcion, condicion FROM nivel_pastor WHERE `;

          for (let i = 0; i < filter.length; i++) {
            query += ` (nombre LIKE '%${filter[i]}%') ${
                i + 1 - filter.length >= 0 ? "" : "AND"
            }`;
          }
          data_out = await db.query(`${query} LIMIT 100`);
        } else {
          data_out = await db.query(
            `SELECT id, nombre, descripcion, condicion FROM nivel_pastor LIMIT 100 `
          );
        }
        if (!data_out.errno) {
          data_data_out = data_out.map((element) => {
            return {
              id: element.id,
              nombre: element.nombre,
              descripcion: element.descripcion,
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
    let nivel_pastor;
    let transaction;
    let data_out;

    try {
      transaction = await database.Transaction(db, async () => {
        if (filter != "") {
          filter = filter.split(" ");

          let query = `SELECT id, nombre FROM nivel_pastor WHERE condicion=1 `;

          for (let i = 0; i < filter.length; i++) {
            query += ` AND (nombre LIKE '%${filter[i]}%')`;
          }
          nivel_pastor = await db.query(`${query} LIMIT 50`);
        } else {
          nivel_pastor = await db.query(
            `SELECT id, nombre FROM nivel_pastor WHERE condicion=1 LIMIT 50`
          );
        }
        if (!nivel_pastor.errno) {
          data_out = nivel_pastor.map((element) => {
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

    return nivel_pastor !== undefined
      ? !nivel_pastor.errno
        ? data_out
        : nivel_pastor
      : transaction;
  },
  findById: async (code) => {
    let nivel_pastor;
    let transaction;
    let data_out;
    try {
      transaction = await database.Transaction(db, async () => {
        nivel_pastor = await db.query(
          `SELECT id, nombre, descripcion FROM nivel_pastor WHERE id=? `,
          [code]
        );

        if (!nivel_pastor.errno) {
          data_out = nivel_pastor.map((element) => {
            return {
              id: element.id,
              nombre: element.nombre,
              descripcion: element.descripcion, 
            };
          });
        }
      });
    } catch (error) {
      return error;
    }

    return nivel_pastor !== undefined
      ? !nivel_pastor.errno
        ? data_out
        : nivel_pastor
      : transaction;
  },

  disableOrEnable: async (data) => {
    const { status, code } = data;
    let nivel_pastor;
    let transaction;

    try {
      transaction = await database.Transaction(db, async () => {
        nivel_pastor = await db.query(
          `UPDATE nivel_pastor SET condicion=? WHERE id=?`,
          [status, code]
        );
      });
    } catch (error) {
      return error;
    }
    return nivel_pastor !== undefined ? nivel_pastor : transaction;
  },
};
