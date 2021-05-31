const database = require("../../config/database.async");
const db = require("../../config/conexion");
module.exports = {
  create: async (data) => {
    const { iglesia, informe } = data;
    let iglesia_reporte;
    let transaction;

    try {
      transaction = await database.Transaction(db, async () => {
        iglesia_reporte = await db.query(
          `INSERT INTO iglesias_informes(iglesia, informe) VALUES (?, ?)`,
          [iglesia, informe]
        );
      });
    } catch (error) {
      return error;
    }
    return iglesia_reporte !== undefined ? iglesia_reporte : transaction;
  },

  findAll: async (filter = "", iglesia) => {
    let iglesias_reportes;
    let transaction;
    let data_iglesias_reportes;
    try {
      transaction = await database.Transaction(db, async () => {
        if (filter != "") {
          filter = filter.split(" ");
          let query = `SELECT II.id, MI.nombre AS informe, DATE_FORMAT(II.fecha_cr, '%d/%m/%Y - %r') AS fecha FROM iglesias_informes II LEFT JOIN maestro_de_informes MI ON II.informe= MI.id LEFT JOIN iglesias I ON II.iglesia=I.codigo WHERE I.id=? AND`;

          for (let i = 0; i < filter.length; i++) {
            query += `  (MI.nombre LIKE '%${filter[i]}%') ${
              i + 1 - filter.length >= 0 ? "" : "AND"
            }`;
          }
          iglesias_reportes = await db.query(`${query} LIMIT 100`, [iglesia]);
        } else {
          iglesias_reportes = await db.query(
            `SELECT II.id, MI.nombre AS informe, DATE_FORMAT(II.fecha_cr, '%d/%m/%Y - %r') AS fecha FROM iglesias_informes II LEFT JOIN maestro_de_informes MI ON II.informe= MI.id LEFT JOIN iglesias I ON II.iglesia=I.codigo WHERE I.id=? LIMIT 100`,
            [iglesia]
          );
        }

        if (!iglesias_reportes.errno) {
          data_iglesias_reportes = iglesias_reportes.map((element) => {
            return {
              id: element.id,
              nombre: element.informe,
              fecha: element.fecha,
            };
          });
        }
      });
    } catch (error) {
      return error;
    }
    return iglesias_reportes !== undefined
      ? !iglesias_reportes.errno
        ? data_iglesias_reportes
        : iglesias_reportes
      : transaction;
  },

  delete: async (data) => {
    const { code } = data;
    let iglesias_reportes;
    let transaction;
    try {
      transaction = await database.Transaction(db, async () => {
        iglesias_reportes = await db.query(
          `DELETE FROM iglesias_informes WHERE id=?`,
          [code]
        );
      });
    } catch (error) {
      return error;
    }

    return iglesias_reportes !== undefined ? iglesias_reportes : transaction;
  },
};
