const database = require("../../config/database.async");
const db = require("../../config/conexion");
const codeGenerator = require("../../helpers/GeneratorCode");
module.exports = {
  create: async (data) => {
    const {
      nombre,
      telefono,
      departamento,
      municipio,
      canton,
      direccion,
      src_google,
      distrito,
      fecha_ordenamiento,
      tipo_iglesia,
      zona,
    } = data;
    let iglesias;
    let transaction;
    let codigo = codeGenerator("ZN");
    try {
      transaction = await database.Transaction(db, async () => {
        iglesias = await db.query(
          `INSERT INTO iglesias(codigo, nombre, telefono, departamento, municipio, canton, direccion, src_google, distrito, fecha_ordenamiento, tipo_iglesia, zona) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
          [
            codigo,
            nombre,
            telefono,
            departamento,
            municipio,
            canton !== "" && canton !== null ? canton : null,
            direccion,
            src_google,
            distrito,
            fecha_ordenamiento !== "" && fecha_ordenamiento !== null
              ? fecha_ordenamiento
              : null,
            tipo_iglesia,
            zona,
          ]
        );
      });
    } catch (error) {
      return error;
    }
    return iglesias !== undefined ? iglesias : transaction;
  },

  update: async (data) => {
    const { code, nombre } = data;
    let iglesias;
    let transaction;

    try {
      transaction = await database.Transaction(db, async () => {
        iglesias = await db.query(`UPDATE iglesias SET nombre=? WHERE id=?`, [
          nombre,
          code,
        ]);
      });
    } catch (error) {
      return error;
    }

    return iglesias !== undefined ? iglesias : transaction;
  },

  findAll: async (filter = "") => {
    let data_out;
    let transaction;
    let data_data_out;

    try {
      transaction = await database.Transaction(db, async () => {
        if (filter != "") {
          filter = filter.split(" ");

          let query = `SELECT id,codigo, nombre, condicion FROM iglesias WHERE `;

          for (let i = 0; i < filter.length; i++) {
            query += ` (nombre LIKE '%${filter[i]}%' OR codigo LIKE '%${
              filter[i]
            }%' )  ${i + 1 - filter.length >= 0 ? "" : "AND"}`;
          }

          data_out = await db.query(`${query} LIMIT 100`);
        } else {
          data_out = await db.query(
            `SELECT id, codigo,nombre, condicion FROM iglesias LIMIT 100`
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
    let iglesias;
    let transaction;
    let data_out;

    try {
      transaction = await database.Transaction(db, async () => {
        if (filter != "") {
          filter = filter.split(" ");

          let query = `SELECT id,codigo, nombre FROM iglesias WHERE condicion=1 `;

          for (let i = 0; i < filter.length; i++) {
            query += ` AND (nombre LIKE '%${filter[i]}%')`;
          }

          iglesias = await db.query(`${query} LIMIT 50`);
        } else {
          iglesias = await db.query(
            `SELECT id,codigo, nombre FROM iglesias WHERE condicion=1 LIMIT 50`
          );
        }
        if (!iglesias.errno) {
          data_out = iglesias.map((element) => {
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

    return iglesias !== undefined
      ? !iglesias.errno
        ? data_out
        : iglesias
      : transaction;
  },
  findById: async (code) => {
    let iglesias;
    let transaction;
    let data_out;
    try {
      transaction = await database.Transaction(db, async () => {
        iglesias = await db.query(
          `SELECT codigo,nombre FROM iglesias WHERE id=? OR codigo=? LIMIT 1`,
          [code, code]
        );

        if (!iglesias.errno) {
          data_out = iglesias.map((element) => {
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

    return iglesias !== undefined
      ? !iglesias.errno
        ? data_out
        : iglesias
      : transaction;
  },
  disableOrEnable: async (data) => {
    const { status, code } = data;
    let iglesias;
    let transaction;

    try {
      transaction = await database.Transaction(db, async () => {
        iglesias = await db.query(
          `UPDATE iglesias SET condicion=? WHERE id=?`,
          [status, code]
        );
      });
    } catch (error) {
      return error;
    }
    return iglesias !== undefined ? iglesias : transaction;
  },
};
