const model = require("../Model");
const comprobations = require("../../helpers/DataComprobations");
const errors = require("../../helpers/OurErrors");
const Token = require("../../services/security/Token");

module.exports = {
  SetProcesado: async (codigoInforme, usuarioToken) => {
    if (!comprobations.areFieldsValid([codigoInforme, usuarioToken])) {
      return errors.faltanDatosError();
    }
    const usuario = Token.decodeToken(usuarioToken).usuario;
    return await model.multipleTransactionQuery(async (dbConnection) => {
      const usuarioCodigo = await dbConnection.query(
        "SELECT persona FROM `usuarios` WHERE id = ?",
        [usuario]
      );

      //obtenemos el prefijo el informe para identificar cual es
      const prefijoInforme = codigoInforme.split("-")[0];

      switch (prefijoInforme) {
        case "IM":
          await dbConnection.query(
            "update informe_ministerial_mensual set estado = 2, usuario_procesado=?, fecha_procesado=current_date() where codigo = ?",
            [usuarioCodigo[0].persona, codigoInforme]
          );
          break;
        case "IT":
          await dbConnection.query(
            "update informe_mesual_tesorero set estado = 2, usuario_procesado=?, fecha_procesado=current_date() where codigo = ?",
            [usuarioCodigo[0].persona, codigoInforme]
          );
          break;
        case "IF":
          await dbConnection.query(
            "update informe_financiero_mensual set estado = 2, usuario_procesado=?, fecha_procesado=current_date() where codigo = ?",
            [usuarioCodigo[0].persona, codigoInforme]
          );
          break;
        default:
          return errors.datosNoEncontrados(
            "No se he encontrado el tipo de informe especificado"
          );
      }

      return await dbConnection.query(
        "update informes_recibidos_gestion set estado = 2 where informe_ide=?",
        [codigoInforme]
      );
    });
  },
};
