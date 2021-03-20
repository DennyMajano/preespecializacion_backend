const database = require("../../config/database.async");
const db = require("../../config/conexion");

module.exports = {
  create: async (data) => {
    const { zona, departamento } = data;
    let zonas_departamentos;
    let transaction;

    try {
      transaction = await database.Transaction(db, async () => {
        zonas_departamentos = await db.query(
          `INSERT INTO zonas_departamentos(zona, departamento) VALUES (?,?)`,
          [zona, departamento]
        );
      });
    } catch (error) {
      return error;
    }

    return zonas_departamentos !== undefined
      ? zonas_departamentos
      : transaction;
  },

  findAll: async (filter = "", codigo) => {
    let data_out;
    let transaction;
    let data_data_out;

    try {
      transaction = await database.Transaction(db, async () => {
        if (filter != "") {
          filter = filter.split(" ");

          let query = `SELECT ZD.id, ZD.zona AS codigo_zona, D.nombre AS departamento FROM zonas_departamentos ZD LEFT JOIN departamentos D ON ZD.departamento=D.id LEFT JOIN zonas Z ON ZD.zona=Z.codigo WHERE (ZD.zona=? OR Z.id=?)`;

          for (let i = 0; i < filter.length; i++) {
            query += ` AND (D.nombre LIKE '%${filter[i]}%' )`;
          }
          data_out = await db.query(`${query} LIMIT 100`, [codigo, codigo]);
        } else {
          data_out = await db.query(
            `SELECT ZD.id, ZD.zona AS codigo_zona, D.nombre AS departamento FROM zonas_departamentos ZD LEFT JOIN departamentos D ON ZD.departamento=D.id LEFT JOIN zonas Z ON ZD.zona=Z.codigo WHERE ZD.zona=? OR Z.id=? LIMIT 100`,
            [codigo, codigo]
          );
        }
        if (!data_out.errno) {
          data_data_out = data_out.map((element) => {
            return {
              id: element.id,
              codigo: element.codigo_zona,
              departamento: element.departamento,
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

  delete: async (data) => {
    const { code } = data;
    let zonas_departamentos;
    let transaction;

    try {
      transaction = await database.Transaction(db, async () => {
        zonas_departamentos = await db.query(
          `DELETE FROM zonas_departamentos WHERE id=?`,
          [code]
        );
      });
    } catch (error) {
      return error;
    }
    return zonas_departamentos !== undefined
      ? zonas_departamentos
      : transaction;
  },
};
