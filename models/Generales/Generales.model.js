const database = require("../../config/database.async");
const db = require("../../config/conexion");
const encryption = require("../../services/encrytion/Encrytion");

module.exports = {
  findAllDepartamento: async (filter = "") => {
    let data;
    let transaction;
    let data_final;

    try {
      transaction = await database.Transaction(db, async () => {
        if (filter != "") {
          filter = filter.split(" ");

          let query = `SELECT id, nombre FROM departamentos`;

          for (let i = 0; i < filter.length; i++) {
            query += ` AND (nombre LIKE '%${filter[i]}%')  ${
              i + 1 - filter.length >= 0 ? "" : "AND"
            }`;
          }

          data = await db.query(`${query}`);
        } else {
          data = await db.query(`SELECT id, nombre FROM departamentos`);
        }
        if (!data.errno) {
          data_final = data.map((element) => {
            return {
              id: encryption.encrypt_id(element.id),
              nombre: element.nombre,
            };
          });
        }
      });
    } catch (error) {
      return error;
    }

    return data !== undefined ? (!data.errno ? data_final : data) : transaction;
  },

  findAllMiselanea: async (grupo) => {
    let data;
    let transaction;
    let data_final;

    try {
      transaction = await database.Transaction(db, async () => {
        data = await db.query(
          `SELECT code, valor FROM miscelanea WHERE grupo=?`,
          [grupo]
        );

        if (!data.errno) {
          data_final = data.map((element) => {
            return {
              id: element.code,
              nombre: element.valor,
            };
          });
        }
      });
    } catch (error) {
      return error;
    }

    return data !== undefined ? (!data.errno ? data_final : data) : transaction;
  },
  findAllSexo: async () => {
    let data;
    let transaction;
    let data_final;

    try {
      transaction = await database.Transaction(db, async () => {
        data = await db.query(`SELECT id, nombre FROM sexo`);

        if (!data.errno) {
          data_final = data.map((element) => {
            return {
              id: encryption.encrypt_id(element.id),
              nombre: element.nombre,
            };
          });
        }
      });
    } catch (error) {
      return error;
    }

    return data !== undefined ? (!data.errno ? data_final : data) : transaction;
  },
  findAllTipoDocumentoIdentificacion: async () => {
    let data;
    let transaction;
    let data_final;

    try {
      transaction = await database.Transaction(db, async () => {
        data = await db.query(
          `SELECT id, nombre FROM tipo_documentos_identificacion`
        );

        if (!data.errno) {
          data_final = data.map((element) => {
            return {
              id: encryption.encrypt_id(element.id),
              nombre: element.nombre,
            };
          });
        }
      });
    } catch (error) {
      return error;
    }

    return data !== undefined ? (!data.errno ? data_final : data) : transaction;
  },
  findAllMotivosBaja: async () => {
    let data;
    let transaction;
    let data_final;

    try {
      transaction = await database.Transaction(db, async () => {
        data = await db.query(
          `SELECT id, nombre FROM motivos_baja_colaboradores`
        );

        if (!data.errno) {
          data_final = data.map((element) => {
            return {
              id: encryption.encrypt_id(element.id),
              nombre: element.nombre,
            };
          });
        }
      });
    } catch (error) {
      return error;
    }

    return data !== undefined ? (!data.errno ? data_final : data) : transaction;
  },
  findAllTiposSaldo: async () => {
    let data;
    let transaction;
    let data_final;

    try {
      transaction = await database.Transaction(db, async () => {
        data = await db.query(`SELECT id, nombre FROM tipos_saldos`);

        if (!data.errno) {
          data_final = data.map((element) => {
            return {
              id: encryption.encrypt_id(element.id),
              nombre: element.nombre,
            };
          });
        }
      });
    } catch (error) {
      return error;
    }

    return data !== undefined ? (!data.errno ? data_final : data) : transaction;
  },

  findAllTipoCuenta: async () => {
    let data;
    let transaction;
    let data_final;

    try {
      transaction = await database.Transaction(db, async () => {
        data = await db.query(
          `SELECT id, nombre_nivel FROM tipo_cuenta WHERE grupo="catalogo_cuenta"`
        );

        if (!data.errno) {
          data_final = data.map((element) => {
            return {
              id: encryption.encrypt_id(element.id),
              nombre: element.nombre_nivel,
            };
          });
        }
      });
    } catch (error) {
      return error;
    }

    return data !== undefined ? (!data.errno ? data_final : data) : transaction;
  },
  findAllTipoProyecto: async () => {
    let data;
    let transaction;
    let data_final;

    try {
      transaction = await database.Transaction(db, async () => {
        data = await db.query(`SELECT id, nombre FROM tipo_proyecto`);

        if (!data.errno) {
          data_final = data.map((element) => {
            return {
              id: encryption.encrypt_id(element.id),
              nombre: element.nombre,
            };
          });
        }
      });
    } catch (error) {
      return error;
    }

    return data !== undefined ? (!data.errno ? data_final : data) : transaction;
  },
};
