const database = require("../../config/database.async");
const db = require("../../config/conexion");
const UID = require("../../helpers/UID");
module.exports = {
  create: async (data) => {
    const { nombre, tipo_informe } = data;
    let maestro_informe
    let transaction;
    try {
      transaction = await database.Transaction(db, async () => {
        maestro_informe = await db.query(
          `INSERT INTO maestro_de_informes(identificador,nombre,tipo_informe) VALUES (?,?,?)`,
          [
            UID(),
            nombre,
            tipo_informe,
          ]
        );
      });
    } catch (error) {
      return error;
    }
    console.log(transaction);
    return maestro_informe !== undefined ? maestro_informe : transaction;
  },

  update: async (data) => {
    const { code, nombre, tipo_informe } = data;
    let maestro_informe;
    let transaction;

    try {
      transaction = await database.Transaction(db, async () => {
        maestro_informe = await db.query(
          `UPDATE maestro_de_informes SET nombre=?, tipo_informe=? WHERE id=?`,
          [nombre, tipo_informe, code]
        );
      });
    } catch (error) {
      return error;
    }

    return maestro_informe !== undefined ? maestro_informe : transaction;
  },

  findAll: async (filter = "") => {
    let data_out;
    let transaction;
    let data_data_out;

    try {
      transaction = await database.Transaction(db, async () => {
        if (filter != "") {
          filter = filter.split(" ");

          let query = `SELECT MI.id, MI.identificador,MI.nombre,TI.nombre AS tipo_informe, MI.condicion FROM maestro_de_informes MI LEFT JOIN tipo_informe TI ON MI.tipo_informe=TI.id WHERE `;

          for (let i = 0; i < filter.length; i++) {
            query += ` (MI.nombre LIKE '%${
              filter[i]
            }%' OR TI.nombre LIKE '%${filter[i]}%'   )  ${
              i + 1 - filter.length >= 0 ? "" : "AND"
            }`;
          }

          data_out = await db.query(`${query} LIMIT 100`);
        } else {
          data_out = await db.query(
            `SELECT MI.id, MI.identificador,MI.nombre,TI.nombre AS tipo_informe, MI.condicion FROM maestro_de_informes MI LEFT JOIN tipo_informe TI ON MI.tipo_informe=TI.id LIMIT 100 `
          );
        }
        if (!data_out.errno) {
          data_data_out = data_out.map((element) => {
            return {
              id: element.id,
              identificador: element.identificador,
              nombre: element.nombre,
              tipo_informe: element.tipo_informe,
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
    let maestro_informe;
    let transaction;
    let data_out;

    try {
      transaction = await database.Transaction(db, async () => {
        if (filter != "") {
          filter = filter.split(" ");

          let query = `SELECT id, nombre FROM maestro_de_informes WHERE condicion=1 `;

          for (let i = 0; i < filter.length; i++) {
            query += ` AND (nombre LIKE '%${filter[i]}%')`;
          }

          maestro_informe = await db.query(`${query} LIMIT 50`);
        } else {
          maestro_informe = await db.query(
            `SELECT id, nombre FROM maestro_de_informes WHERE condicion=1 LIMIT 50`
          );
        }
        if (!maestro_informe.errno) {
          data_out = maestro_informe.map((element) => {
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

    return maestro_informe !== undefined
      ? !maestro_informe.errno
        ? data_out
        : maestro_informe
      : transaction;
  },
  findById: async (code) => {
    let maestro_informe;
    let transaction;
    let data_out;
    try {
      transaction = await database.Transaction(db, async () => {
        maestro_informe = await db.query(
          `SELECT MI.id ,MI.nombre, TI.id AS tipo_id, TI.nombre AS tipo_informe FROM maestro_de_informes MI LEFT JOIN tipo_informe TI ON MI.tipo_informe=TI.id WHERE MI.id=? `,
          [code]
        );

        if (!maestro_informe.errno) {
          data_out = maestro_informe.map((element) => {
            return {
              id: element.id,
              nombre: element.nombre,
              tipo_id: element.tipo_id,
              tipo_informe: element.tipo_informe,
            };
          });
        }
      });
    } catch (error) {
      return error;
    }

    return maestro_informe !== undefined
      ? !maestro_informe.errno
        ? data_out
        : maestro_informe
      : transaction;
  },
  disableOrEnable: async (data) => {
    const { status, code } = data;
    let maestro_informe;
    let transaction;

    try {
      transaction = await database.Transaction(db, async () => {
        maestro_informe = await db.query(
          `UPDATE maestro_de_informes SET condicion=? WHERE id=?`,
          [status, code]
        );
      });
    } catch (error) {
      return error;
    }
    return maestro_informe !== undefined ? maestro_informe : transaction;
  },
};
