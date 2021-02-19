const database = require("../../config/database.async");
const db = require("../../config/conexion");
const Encrytion = require("../../services/encrytion/Encrytion");

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

  checkTokenToChangePassword: async(token) => {
    let result;
    let tokenRegisteredRow;
    let transactionResult; // Almacena el resultado de la transaccion, error en caso fallido, los resultados de la transaccion en caso contrario
    try{
      transactionResult = await database.Transaction(db, async () => {
        tokenRegisteredRow = await db.query(
          "SELECT  `vencimiento`, `vigente`, `utilizado` FROM `cambios_password` WHERE `token` = ?",
          [token]
          );

      });
      console.log("Token result");
      console.log(tokenRegisteredRow);
      console.log("Token Transaction result");
      console.log(transactionResult);

      if(!transactionResult.errno){
        if(tokenRegisteredRow.length>0 && tokenRegisteredRow[0].vigente == 1){
          if(tokenRegisteredRow[0].vencimiento > Date.now()){
            result = 1; //Valido
          }
          else{
            result = 0; // Vencido
          }
        }
        else{
          result = -1; // Invalido
        }
        return result;
      }
      else{
        throw transactionResult;
      }
    }
    catch(error){
      return error;
    }
  }
};
