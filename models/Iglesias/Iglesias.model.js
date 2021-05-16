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
    let codigo = codeGenerator("IGLE");
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
    const {
      code,
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

    try {
      transaction = await database.Transaction(db, async () => {
        iglesias = await db.query(
          `UPDATE iglesias SET nombre=?,telefono=?,departamento=?,municipio=?,canton=?,direccion=?,src_google=?,distrito=?,fecha_ordenamiento=?,tipo_iglesia=?,zona=? WHERE id=?`,
          [
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
            code,
          ]
        );
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

          let query = `SELECT I.id, I.codigo, I.nombre, I.telefono,  D.nombre AS departamento, M.nombre AS municipio, DTTO.nombre AS distrito, DATE_FORMAT(I.fecha_ordenamiento, '%d/%m/%Y') AS fecha_ordenamiento, TI.nombre AS tipo_iglesia, Z.nombre AS zona, DATE_FORMAT(I.fecha_cr, '%d/%m/%Y %r') AS fecha_registro,DATE_FORMAT(I.fecha_uac, '%d/%m/%Y %r') AS fecha_actualizacion FROM iglesias I LEFT JOIN departamentos D ON I.departamento=D.id LEFT JOIN municipios M ON I.municipio=M.id LEFT JOIN cantones C ON I.canton= C.id LEFT JOIN distritos DTTO ON I.distrito=DTTO.codigo LEFT JOIN zonas Z ON I.zona=Z.codigo LEFT JOIN tipo_iglesias TI ON I.tipo_iglesia=TI.id  WHERE `;

          for (let i = 0; i < filter.length; i++) {
            query += ` (I.nombre LIKE '%${filter[i]}%' OR I.codigo LIKE '%${
              filter[i]
            }%' OR D.nombre LIKE '%${filter[i]}%' OR M.nombre LIKE '%${
              filter[i]
            }%' OR DTTO.nombre LIKE '%${filter[i]}%' OR Z.nombre LIKE '%${
              filter[i]
            }%')  ${i + 1 - filter.length >= 0 ? "" : "AND"}`;
          }

          data_out = await db.query(`${query} LIMIT 100`);
        } else {
          data_out = await db.query(
            `SELECT I.id, I.codigo, I.nombre, I.telefono,  D.nombre AS departamento, M.nombre AS municipio, DTTO.nombre AS distrito, DATE_FORMAT(I.fecha_ordenamiento, '%d/%m/%Y') AS fecha_ordenamiento, TI.nombre AS tipo_iglesia, Z.nombre AS zona, DATE_FORMAT(I.fecha_cr, '%d/%m/%Y %r') AS fecha_registro,DATE_FORMAT(I.fecha_uac, '%d/%m/%Y %r') AS fecha_actualizacion, I.condicion FROM iglesias I LEFT JOIN departamentos D ON I.departamento=D.id LEFT JOIN municipios M ON I.municipio=M.id LEFT JOIN cantones C ON I.canton= C.id LEFT JOIN distritos DTTO ON I.distrito=DTTO.codigo LEFT JOIN zonas Z ON I.zona=Z.codigo LEFT JOIN tipo_iglesias TI ON I.tipo_iglesia=TI.id  LIMIT 100`
          );
        }
        if (!data_out.errno) {
          data_data_out = data_out.map((element) => {
            return {
              id: element.id,
              codigo: element.codigo,
              nombre: element.nombre,
              telefono: element.telefono,
              departamento: element.departamento,
              municipio: element.municipio,
              distrito: element.distrito,
              fecha_ordenamiento: element.fecha_ordenamiento,
              tipo_iglesia: element.tipo_iglesia,
              zona: element.zona,
              fecha_registro: element.fecha_registro,
              fecha_actualizacion: element.fecha_actualizacion,
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

  findAllVisor: async (filter = "") => {
    let data_out;
    let transaction;
    let data_data_out;

    try {
      transaction = await database.Transaction(db, async () => {
        if (filter != "") {
          filter = filter.split(" ");

          let query = `SELECT I.id, I.codigo, I.nombre, I.telefono,  D.nombre AS departamento, M.nombre AS municipio, DTTO.nombre AS distrito, DATE_FORMAT(I.fecha_ordenamiento, '%d/%m/%Y') AS fecha_ordenamiento, TI.nombre AS tipo_iglesia, Z.nombre AS zona, DATE_FORMAT(I.fecha_cr, '%d/%m/%Y %r') AS fecha_registro,DATE_FORMAT(I.fecha_uac, '%d/%m/%Y %r') AS fecha_actualizacion FROM iglesias I LEFT JOIN departamentos D ON I.departamento=D.id LEFT JOIN municipios M ON I.municipio=M.id LEFT JOIN cantones C ON I.canton= C.id LEFT JOIN distritos DTTO ON I.distrito=DTTO.codigo LEFT JOIN zonas Z ON I.zona=Z.codigo LEFT JOIN tipo_iglesias TI ON I.tipo_iglesia=TI.id  WHERE I.condicion=1 AND`;

          for (let i = 0; i < filter.length; i++) {
            query += ` (I.nombre LIKE '%${filter[i]}%' OR I.codigo LIKE '%${
              filter[i]
            }%' OR D.nombre LIKE '%${filter[i]}%' OR M.nombre LIKE '%${
              filter[i]
            }%' OR DTTO.nombre LIKE '%${filter[i]}%' OR Z.nombre LIKE '%${
              filter[i]
            }%')  ${i + 1 - filter.length >= 0 ? "" : "AND"}`;
          }

          data_out = await db.query(`${query} LIMIT 100`);
        } else {
          data_out = await db.query(
            `SELECT I.id, I.codigo, I.nombre, I.telefono,  D.nombre AS departamento, M.nombre AS municipio, DTTO.nombre AS distrito, DATE_FORMAT(I.fecha_ordenamiento, '%d/%m/%Y') AS fecha_ordenamiento, TI.nombre AS tipo_iglesia, Z.nombre AS zona, DATE_FORMAT(I.fecha_cr, '%d/%m/%Y %r') AS fecha_registro,DATE_FORMAT(I.fecha_uac, '%d/%m/%Y %r') AS fecha_actualizacion FROM iglesias I LEFT JOIN departamentos D ON I.departamento=D.id LEFT JOIN municipios M ON I.municipio=M.id LEFT JOIN cantones C ON I.canton= C.id LEFT JOIN distritos DTTO ON I.distrito=DTTO.codigo LEFT JOIN zonas Z ON I.zona=Z.codigo LEFT JOIN tipo_iglesias TI ON I.tipo_iglesia=TI.id WHERE I.condicion=1  LIMIT 100`
          );
        }
        if (!data_out.errno) {
          data_data_out = data_out.map((element) => {
            return {
              id: element.id,
              codigo: element.codigo,
              nombre: element.nombre,
              telefono: element.telefono,
              departamento: element.departamento,
              municipio: element.municipio,
              distrito: element.distrito,
              fecha_ordenamiento: element.fecha_ordenamiento,
              tipo_iglesia: element.tipo_iglesia,
              zona: element.zona,
              fecha_registro: element.fecha_registro,
              fecha_actualizacion: element.fecha_actualizacion,
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

          let query = `SELECT id, codigo, nombre FROM iglesias WHERE condicion=1 `;

          for (let i = 0; i < filter.length; i++) {
            query += ` AND (nombre LIKE '%${filter[i]}%')`;
          }

          iglesias = await db.query(`${query} LIMIT 50`);
        } else {
          iglesias = await db.query(
            `SELECT id, codigo, nombre FROM iglesias WHERE condicion=1 LIMIT 50`
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
          `SELECT I.id, I.codigo, I.nombre, I.telefono, I.departamento AS departamento_id, D.nombre AS departamento_nombre, I.municipio AS municipio_id, M.nombre AS municipio_nombre, I.canton AS canton_id, C.nombre AS canton_nombre, I.direccion, I.src_google, DTTO.id AS distrito_id, I.distrito AS distrito_codigo, DTTO.nombre AS distrito_nombre, I.fecha_ordenamiento, I.tipo_iglesia AS tipo_iglesia_id, TI.nombre AS tipo_iglesia_nombre, Z.id AS zona_id, I.zona AS zona_codigo,Z.nombre AS zona_nombre FROM iglesias I LEFT JOIN departamentos D ON I.departamento=D.id LEFT JOIN municipios M ON I.municipio=M.id LEFT JOIN cantones C ON I.canton= C.id LEFT JOIN distritos DTTO ON I.distrito=DTTO.codigo LEFT JOIN zonas Z ON I.zona=Z.codigo LEFT JOIN tipo_iglesias TI ON I.tipo_iglesia=TI.id WHERE I.id=? OR I.codigo=? LIMIT 1`,
          [code, code]
        );

        if (!iglesias.errno) {
          data_out = iglesias.map((element) => {
            return {
              codigo: element.codigo,
              telefono: element.telefono,
              nombre: element.nombre,
              src_google: element.src_google,
              departamento:
                element.departamento_id !== null
                  ? {
                      label: element.departamento_nombre,
                      value: element.departamento_id,
                    }
                  : "",
              municipio:
                element.municipio_id !== null
                  ? {
                      label: element.municipio_nombre,
                      value: element.municipio_id,
                    }
                  : "",
              canton:
                element.canton_id !== null
                  ? {
                      label: element.canton_nombre,
                      value: element.canton_id,
                    }
                  : "",
              direccion: element.direccion,
              distrito:
                element.distrito_codigo !== null
                  ? {
                      label: element.distrito_nombre,
                      value: element.distrito_id,
                      codigo: element.distrito_codigo,
                    }
                  : "",
              fecha_ordenamiento: element.fecha_ordenamiento,
              zona:
                element.zona_codigo !== null
                  ? {
                      label: element.zona_nombre,
                      value: element.zona_id,
                      codigo: element.zona_codigo,
                    }
                  : "",
              tipo_iglesia:
                element.tipo_iglesia_id !== null
                  ? {
                      label: element.tipo_iglesia_nombre,
                      value: element.tipo_iglesia_id,
                    }
                  : "",
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
  findDetalleById: async (code) => {
    let iglesias;
    let transaction;
    let data_out;
    try {
      transaction = await database.Transaction(db, async () => {
        iglesias = await db.query(
          `SELECT I.id, I.codigo, I.nombre, I.telefono, D.nombre AS departamento_nombre, M.nombre AS municipio_nombre, C.nombre AS canton_nombre, I.direccion, I.src_google, I.distrito AS distrito_codigo, DTTO.nombre AS distrito_nombre, I.fecha_ordenamiento,TI.nombre AS tipo_iglesia_nombre, I.zona AS zona_codigo,Z.nombre AS zona_nombre FROM iglesias I LEFT JOIN departamentos D ON I.departamento=D.id LEFT JOIN municipios M ON I.municipio=M.id LEFT JOIN cantones C ON I.canton= C.id LEFT JOIN distritos DTTO ON I.distrito=DTTO.codigo LEFT JOIN zonas Z ON I.zona=Z.codigo LEFT JOIN tipo_iglesias TI ON I.tipo_iglesia=TI.id WHERE I.id=? OR I.codigo=? LIMIT 1`,
          [code, code]
        );

        if (!iglesias.errno) {
          console.log(iglesias);

          data_out = iglesias.map((element) => {
            return {
              codigo: element.codigo,
              telefono: element.telefono,
              nombre: element.nombre,
              departamento: element.departamento_nombre,
              municipio: element.municipio_nombre,
              canton: element.canton_nombre,
              direccion: element.direccion,
              ruta_mapa: element.src_google,
              distrito: element.distrito_nombre,
              distrito_codigo: element.distrito_codigo,
              fecha_ordenamiento: element.fecha_ordenamiento,
              zona: element.zona_nombre,
              zona_codigo: element.zona_codigo,
              tipo_iglesia: element.tipo_iglesia_nombre,
            };
          });
        }
      });
    } catch (error) {
      return error;
    }
    console.log(transaction);
    return iglesias !== undefined
      ? !iglesias.errno
        ? data_out
        : iglesias
      : transaction;
  },

  findInformeById: async (code) => {
    let iglesias;
    let transaction;
    let data_out;
    try {
      transaction = await database.Transaction(db, async () => {
        iglesias = await db.query(
          `SELECT I.id, I.codigo, I.nombre, I.telefono, D.nombre AS departamento_nombre, M.nombre AS municipio_nombre, C.nombre AS canton_nombre, I.direccion, I.src_google, I.distrito AS distrito_codigo, DTTO.nombre AS distrito_nombre, I.fecha_ordenamiento,TI.nombre AS tipo_iglesia_nombre, I.zona AS zona_codigo,Z.nombre AS zona_nombre FROM iglesias I LEFT JOIN departamentos D ON I.departamento=D.id LEFT JOIN municipios M ON I.municipio=M.id LEFT JOIN cantones C ON I.canton= C.id LEFT JOIN distritos DTTO ON I.distrito=DTTO.codigo LEFT JOIN zonas Z ON I.zona=Z.codigo LEFT JOIN tipo_iglesias TI ON I.tipo_iglesia=TI.id WHERE I.id=? OR I.codigo=? LIMIT 1`,
          [code, code]
        );

        if (!iglesias.errno) {
          console.log(iglesias);

          data_out = iglesias.map((element) => {
            return {
              codigo: element.codigo,
              nombre: element.nombre,
              telefono: element.telefono,
              departamento: element.departamento_nombre,
              municipio: element.municipio_nombre,
              canton: element.canton_nombre,
              direccion: element.direccion,
              ruta_mapa: element.src_google,
              distrito: element.distrito_nombre,
              distrito_codigo: element.distrito_codigo,
              fecha_ordenamiento: element.fecha_ordenamiento,
              zona: element.zona_nombre,
              zona_codigo: element.zona_codigo,
              tipo_iglesia: element.tipo_iglesia_nombre,
            };
          });
        }
      });
    } catch (error) {
      return error;
    }
    console.log(transaction);
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
