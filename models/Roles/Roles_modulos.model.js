const database = require("../../config/database.async");
const db = require("../../config/conexion");
module.exports = {
  create: async (data) => {
    const { modulo, rol } = data;
    let rol_modulo;
    let transaction;
    let padre_insertado;
    let idpadre;
    try {
      transaction = await database.Transaction(db, async () => {
        padre_insertado = await db.query(
          "SELECT COUNT(*) AS insertado FROM roles_modulos WHERE modulo=(SELECT nivel_principal FROM modulos WHERE id=?) AND rol=? LIMIT 1",
          [modulo, rol]
        );

        if (padre_insertado[0].insertado === 0) {
          idpadre = await db.query(
            "SELECT nivel_principal AS valor FROM modulos WHERE id=? LIMIT 1",
            [modulo]
          );

          if (idpadre[0].valor > 0) {
            rol_modulo = await db.query(
              `INSERT INTO roles_modulos(modulo, rol) VALUES (?,?)`,
              [idpadre[0].valor, rol]
            );
          } else {
            rol_modulo = await db.query(
              `INSERT INTO roles_modulos(modulo, rol) VALUES (?,?)`,
              [modulo, rol]
            );
          }
        }
        rol_modulo = await db.query(
          `INSERT INTO roles_modulos(modulo, rol) VALUES (?,?)`,
          [modulo, rol]
        );
      });
    } catch (error) {
      return error;
    }
    return rol_modulo !== undefined ? rol_modulo : transaction;
  },

  findAll: async (filter = "", rol) => {
    let roles_modulos;
    let transaction;
    let data_roles_modulos;
    try {
      transaction = await database.Transaction(db, async () => {
        if (filter != "") {
          filter = filter.split(" ");
          let query = `SELECT rm.id, m.nombre, rm.condicion AS status, m.es_principal AS e_padre, (SELECT nombre FROM modulos WHERE id= m.nivel_principal) AS nivel_principal, DATE_FORMAT(rm.fecha_cr,"%W %d de %M del %Y, %I:%i %p") AS fecha_creacion, rm.fecha_uac AS fecha_actualizacion FROM roles_modulos rm LEFT JOIN modulos m ON rm.modulo=m.id WHERE rm.rol=${rol} AND`;

          for (let i = 0; i < filter.length; i++) {
            query += `  (m.nombre LIKE '%${filter[i]}%') ${
              i + 1 - filter.length >= 0 ? "" : "AND"
            }`;
          }
          roles_modulos = await db.query(
            `${query} ORDER BY m.nombre ASC LIMIT 100`
          );
        } else {
          roles_modulos = await db.query(
            `SELECT rm.id, m.nombre, rm.condicion AS status, m.es_principal AS e_padre, (SELECT nombre FROM modulos WHERE id= m.nivel_principal) AS nivel_principal, DATE_FORMAT(rm.fecha_cr,"%W %d de %M del %Y, %I:%i %p") AS fecha_creacion, rm.fecha_uac AS fecha_actualizacion FROM roles_modulos rm LEFT JOIN modulos m ON rm.modulo=m.id WHERE rm.rol=${rol} ORDER BY m.nombre ASC LIMIT 100`
          );
        }

        if (!roles_modulos.errno) {
          data_roles_modulos = roles_modulos.map((element) => {
            return {
              id: element.id,
              nombre: element.nombre,
              status: element.status,
              e_padre: element.e_padre,
              nivel_principal: element.nivel_principal,
              fecha_creacion: element.fecha_creacion,
              fecha_actualizacion: element.fecha_actualizacion,
            };
          });
        }
      });
    } catch (error) {
      return error;
    }
    return roles_modulos !== undefined
      ? !roles_modulos.errno
        ? data_roles_modulos
        : roles_modulos
      : transaction;
  },

  delete: async (data) => {
    const { code } = data;
    let roles_modulos;
    let transaction;
    let modulos_p;
    let es_principal;
    let delete_hijos;
    try {
      transaction = await database.Transaction(db, async () => {
        es_principal = await db.query(
          "SELECT id, (SELECT rol FROM roles_modulos WHERE id=?) AS rol, es_principal FROM modulos WHERE id=(SELECT modulo FROM roles_modulos WHERE id=?)",
          [code, code]
        );
        let esprincipal =
          es_principal.length > 0 ? es_principal[0].es_principal : 0;
        if (esprincipal === 1) {
          modulos_p = await db.query(
            "SELECT id FROM modulos WHERE nivel_principal=?",
            [es_principal[0].id]
          );

          if (modulos_p.length > 0) {
            for await (const mod of modulos_p) {
              delete_hijos = await db.query(
                `DELETE FROM roles_modulos WHERE rol=? AND modulo=?`,
                [es_principal[0].rol, mod.id]
              );
            }
          }
          roles_modulos = await db.query(
            `DELETE FROM roles_modulos WHERE id=?`,
            [code]
          );
        } else {
          roles_modulos = await db.query(
            `DELETE FROM roles_modulos WHERE id=?`,
            [code]
          );
        }
      });
    } catch (error) {
      return error;
    }

    return roles_modulos !== undefined ? roles_modulos : transaction;
  },
};
