const database = require("../../config/database.async");
const db = require("../../config/conexion");
module.exports = {
  create: async (data) => {
    //   Niveles Academicos Pastorales
    const { nombre } = data;
    let nivel_academico;
    let transaction;
    try {
      transaction = await database.Transaction(db, async () => {
        nivel_academico = await db.query(
          `INSERT INTO niveles_academicos_pastorales(nombre) VALUES (?)`,
          [nombre]
        );
      });
    } catch (error) {
      return error;
    }
    return nivel_academico !== undefined ? nivel_academico : transaction;
  },

  update: async (data) => {
    const { code, nombre } = data;
    let nivel_academico;
    let transaction;
    try {
      transaction = await database.Transaction(db, async () => {
        nivel_academico = await db.query(
          `UPDATE niveles_academicos_pastorales SET nombre=? WHERE id=?`,
          [nombre, code]
        );
      });
    } catch (error) {
      return error;
    }

    return nivel_academico !== undefined ? nivel_academico : transaction;
  },

  findAll: async (filter = "") => {
    let data_out;
    let transaction;
    let data_data_out;

    try {
      transaction = await database.Transaction(db, async () => {
        if (filter != "") {
          filter = filter.split(" ");

          let query = `SELECT id, nombre, condicion FROM niveles_academicos_pastorales WHERE `;

          for (let i = 0; i < filter.length; i++) {
            query += ` (nombre LIKE '%${filter[i]}%') ${
              i + 1 - filter.length >= 0 ? "" : "AND"
            }`;
          }
          data_out = await db.query(`${query} LIMIT 100`);
        } else {
          data_out = await db.query(
            `SELECT id, nombre, condicion FROM niveles_academicos_pastorales LIMIT 100 `
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
    let nivel_academico;
    let transaction;
    let data_out;

    try {
      transaction = await database.Transaction(db, async () => {
        if (filter != "") {
          filter = filter.split(" ");

          let query = `SELECT id, nombre FROM niveles_academicos_pastorales WHERE condicion=1 `;

          for (let i = 0; i < filter.length; i++) {
            query += ` AND (nombre LIKE '%${filter[i]}%')`;
          }
          nivel_academico = await db.query(`${query} LIMIT 50`);
        } else {
          nivel_academico = await db.query(
            `SELECT id, nombre FROM niveles_academicos_pastorales WHERE condicion=1 LIMIT 50`
          );
        }
        if (!nivel_academico.errno) {
          data_out = nivel_academico.map((element) => {
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

    return nivel_academico !== undefined
      ? !nivel_academico.errno
        ? data_out
        : nivel_academico
      : transaction;
  },

  findById: async (code) => {
    let nivel_academico;
    let transaction;
    let data_out;
    try {
      transaction = await database.Transaction(db, async () => {
        nivel_academico = await db.query(
          `SELECT id, nombre FROM niveles_academicos_pastorales WHERE id=? `,
          [code]
        );

        if (!nivel_academico.errno) {
          data_out = nivel_academico.map((element) => {
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

    return nivel_academico !== undefined
      ? !nivel_academico.errno
        ? data_out
        : nivel_academico
      : transaction;
  },

  disableOrEnable: async (data) => {
    const { status, code } = data;
    let nivel_academico;
    let transaction;

    try {
      transaction = await database.Transaction(db, async () => {
        nivel_academico = await db.query(
          `UPDATE niveles_academicos_pastorales SET condicion=? WHERE id=?`,
          [status, code]
        );
      });
    } catch (error) {
      return error;
    }
    return nivel_academico !== undefined ? nivel_academico : transaction;
  },
};
