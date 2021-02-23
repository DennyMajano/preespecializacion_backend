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
     
          data = await db.query(`SELECT id, nombre FROM departamentos`);
        
        if (!data.errno) {
          data_final = data.map((element) => {
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

    return data !== undefined ? (!data.errno ? data_final : data) : transaction;
  },
  findAllMunicipios: async (filter = "", dep) => {
    let data;
    let transaction;
    let data_final;

    try {
      transaction = await database.Transaction(db, async () => {
        if (filter != "") {
          filter = filter.split(" ");

          let query = `SELECT id, nombre FROM municipios WHERE departamento=${dep} AND`;

          for (let i = 0; i < filter.length; i++) {
            query += ` (nombre LIKE '%${filter[i]}%')  ${
              i + 1 - filter.length >= 0 ? "" : "AND"
            }`;
          }

          data = await db.query(`${query} LIMIT 50`);
        } else {
          data = await db.query(`SELECT id, nombre FROM municipios WHERE departamento=${dep} LIMIT 50`);
        }
        if (!data.errno) {
          data_final = data.map((element) => {
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

    return data !== undefined ? (!data.errno ? data_final : data) : transaction;
  },
  findAllCantones: async (filter = "", municipio) => {
    let data;
    let transaction;
    let data_final;

    try {
      transaction = await database.Transaction(db, async () => {
        if (filter != "") {
          filter = filter.split(" ");

          let query = `SELECT id, nombre FROM cantones WHERE municipio=${municipio} AND`;

          for (let i = 0; i < filter.length; i++) {
            query += ` (nombre LIKE '%${filter[i]}%')  ${
              i + 1 - filter.length >= 0 ? "" : "AND"
            }`;
          }

          data = await db.query(`${query} LIMIT 50`);
        } else {
          data = await db.query(`SELECT id, nombre FROM cantones WHERE municipio=${municipio} LIMIT 50`);
        }
        if (!data.errno) {
          data_final = data.map((element) => {
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

    return data !== undefined ? (!data.errno ? data_final : data) : transaction;
  },
  findAllNacionalidad: async (filter = "") => {
    let data;
    let transaction;
    let data_final;

    try {
      transaction = await database.Transaction(db, async () => {
        if (filter != "") {
          filter = filter.split(" ");

          let query = `SELECT id, nacionalidad FROM nacionalidades WHERE`;

          for (let i = 0; i < filter.length; i++) {
            query += ` (nacionalidad LIKE '%${filter[i]}%')  ${
              i + 1 - filter.length >= 0 ? "" : "AND"
            }`;
          }

          data = await db.query(`${query} LIMIT 50`);
        } else {
          data = await db.query(`SELECT id, nacionalidad FROM nacionalidades LIMIT 50`);
        }
        if (!data.errno) {
          data_final = data.map((element) => {
            return {
              id: element.id,
              nombre: element.nacionalidad,
            };
          });
        }
      });
    } catch (error) {
      return error;
    }

    return data !== undefined ? (!data.errno ? data_final : data) : transaction;
  },

  findAllEstadoCivil: async () => {
    let data;
    let transaction;
    let data_final;

    try {
      transaction = await database.Transaction(db, async () => {
        data = await db.query(`SELECT id, nombre FROM estados_civiles`);

        if (!data.errno) {
          data_final = data.map((element) => {
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

    return data !== undefined ? (!data.errno ? data_final : data) : transaction;
  },
  findAllTipoIglesia: async () => {
    let data;
    let transaction;
    let data_final;

    try {
      transaction = await database.Transaction(db, async () => {
        data = await db.query(`SELECT id, nombre FROM tipo_iglesias`);

        if (!data.errno) {
          data_final = data.map((element) => {
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
  findAllTipoDocumento: async () => {
    let data;
    let transaction;
    let data_final;

    try {
      transaction = await database.Transaction(db, async () => {
        data = await db.query(
          `SELECT id, nombre FROM tipos_documentos`
        );

        if (!data.errno) {
          data_final = data.map((element) => {
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

    return data !== undefined ? (!data.errno ? data_final : data) : transaction;
  },

};
