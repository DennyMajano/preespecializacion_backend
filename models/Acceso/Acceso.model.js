const database = require("../../config/database.async");
const db = require("../../config/conexion");

module.exports = {
  acceso: async (data) => {
    const { correo_electronico } = data;
    let acceso;
    let transaction;
    let modulos;
    let data_out;
    try {
      transaction = await database.Transaction(db, async () => {
        acceso = await db.query(
          `SELECT id, persona, iglesia, correo_electronico, rol, password, alias FROM usuarios WHERE correo_electronico=? AND password_defecto=0 AND estado=1 LIMIT 1`,
          [correo_electronico]
        );

        modulos = await db.query(
          `SELECT M.identificador AS modulo FROM roles_modulos RM INNER JOIN modulos M ON RM.modulo=M.id WHERE rol=?`,
          [acceso.length > 0 ? acceso[0].rol : 0]
        );

        if (!acceso.errno && !modulos.errno) {
          data_out = {
            acceso,
            modulos,
          };
        } else {
          data_out = 0;
        }
      });
    } catch (error) {
      return error;
    }
    console.log(acceso);
    return acceso !== undefined && modulos !== undefined
      ? data_out
      : transaction;
  },
};
