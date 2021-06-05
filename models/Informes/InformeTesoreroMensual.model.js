const model = require("../Model");
const comprobations = require("../../helpers/DataComprobations");
const errors = require("../../helpers/OurErrors");
const GeneratorCode = require("../../helpers/GeneratorCode");
const Token = require("../../services/security/Token");

const PREFIJO_INFORME = "IT";
module.exports = {
  getInfoByCodigo: async (codigoInforme) => {
    if (!comprobations.areFieldsValid([codigoInforme])) {
      return errors.faltanDatosError();
    }

    return await model.multipleTransactionQuery(async (dbConnection) => {
      return dbConnection.query(
        `
        SELECT diezmos_recibidos_iglesia as diezmosRecibidosIglesia,
        diezmo_enviado_oficina as diezmoEnviadoOficina, 
        diezmos_entregados_pastor as diezmosEntregadosPastor,
        membresia_patrimonio_historico as membresiaPatrimonioHistorico, ofrenda_misionera_segundo_domingo as ofrendaMisioneraSegundoDomingo, 
        impulso_misiones as impulsoMisiones, 
        porcentaje_misioneros_oficina as porcentajeMisionerosOficina, 
        misiones_nacionales as misionesNacionales, 
        entrada_fondo_local as entradaFondoLocal, 
        diezmos_fondo_local as diezmosFondoLocal, 
        fondo_retiro_pastoral as fondoRetiroPastoral, 
        dinero_otros_propositos as dineroOtrosPropositos, 
        ofrenda_emergencia_nacional as ofrendaEmergenciaNacional, 
        fondo_solidario_ministerial as fondoSolidarioMinisterial, 
        total_miembros as totalMiembros, 
        masculinos, femeninos, excluidos, trasladados FROM detalle_informe_mensual_tesorero where informe_mesual_tesorero = ?
        `,
        [codigoInforme]
      );
    });
  },
  create: async (data) => {
    const {
      estado,
      usuarioToken,
      codigoIglesia,
      nombreTesorero,
      codigoPastor,
      codigoGestion,
      telefono,
      direccion,
      mail,
    } = data.cabecera;
    const {
      diezmosRecibidosIglesia,
      diezmoEnviadoOficina,
      diezmosEntregadosPastor,
      membresiaPatrimonioHistorico,
      ofrendaMisioneraSegundoDomingo,
      impulsoMisiones,
      porcentajeMisionerosOficina,
      misionesNacionales,
      entradaFondoLocal,
      diezmosFondoLocal,
      fondoRetiroPastoral,
      dineroOtrosPropositos,
      ofrendaEmergenciaNacional,
      fondoSolidarioMinisterial,
      totalMiembros,
      masculinos,
      femeninos,
      excluidos,
      trasladados,
    } = data.detalle;

    if (
      !comprobations.areFieldsValid([
        //Campos de cabecera
        estado,
        usuarioToken,
        codigoIglesia,
        nombreTesorero,
        codigoGestion,
        telefono,
        direccion,
        mail,
        //Campos de detalle
        diezmosRecibidosIglesia,
        diezmoEnviadoOficina,
        diezmosEntregadosPastor,
        membresiaPatrimonioHistorico,
        ofrendaMisioneraSegundoDomingo,
        impulsoMisiones,
        porcentajeMisionerosOficina,
        misionesNacionales,
        entradaFondoLocal,
        diezmosFondoLocal,
        fondoRetiroPastoral,
        dineroOtrosPropositos,
        ofrendaEmergenciaNacional,
        fondoSolidarioMinisterial,
        totalMiembros,
        masculinos,
        femeninos,
        excluidos,
        trasladados,
      ])
    ) {
      return errors.faltanDatosError();
    }
    //generados el codigo
    const codigoInforme = GeneratorCode(PREFIJO_INFORME);
    //Obtenemos el id del usuario del token.
    const usuario = Token.decodeToken(usuarioToken).usuario;
    const result = await model.connection.query(
      `call crearInformeTesoreroMensual(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        usuario,
        codigoPastor,
        codigoGestion,
        codigoIglesia,
        estado,
        codigoInforme,
        nombreTesorero,

        telefono,
        direccion,
        mail,
        //Campos para detalle
        diezmosRecibidosIglesia,
        diezmoEnviadoOficina,
        diezmosEntregadosPastor,
        membresiaPatrimonioHistorico,
        ofrendaMisioneraSegundoDomingo,
        impulsoMisiones,
        porcentajeMisionerosOficina,
        misionesNacionales,
        entradaFondoLocal,
        diezmosFondoLocal,
        fondoRetiroPastoral,
        dineroOtrosPropositos,
        ofrendaEmergenciaNacional,
        fondoSolidarioMinisterial,
        totalMiembros,
        masculinos,
        femeninos,
        excluidos,
        trasladados,
      ]
    );
    console.log("---------");
    console.log(result[0][0].codigoInforme);
    console.log("----------");
    return result[0][0];
  },
  update: async (data) => {
    const {
      usuarioToken,
      estado,
      codigoInforme, //codigo de la cabecera
      diezmosRecibidosIglesia,
      diezmoEnviadoOficina,
      diezmosEntregadosPastor,
      membresiaPatrimonioHistorico,
      ofrendaMisioneraSegundoDomingo,
      impulsoMisiones,
      porcentajeMisionerosOficina,
      misionesNacionales,
      entradaFondoLocal,
      diezmosFondoLocal,
      fondoRetiroPastoral,
      dineroOtrosPropositos,
      ofrendaEmergenciaNacional,
      fondoSolidarioMinisterial,
      totalMiembros,
      masculinos,
      femeninos,
      excluidos,
      trasladados,
    } = data;
    if (
      !comprobations.areFieldsValid([
        usuarioToken,
        estado,
        codigoInforme, //codigo de la cabecera
        diezmosRecibidosIglesia,
        diezmoEnviadoOficina,
        diezmosEntregadosPastor,
        membresiaPatrimonioHistorico,
        ofrendaMisioneraSegundoDomingo,
        impulsoMisiones,
        porcentajeMisionerosOficina,
        misionesNacionales,
        entradaFondoLocal,
        diezmosFondoLocal,
        fondoRetiroPastoral,
        dineroOtrosPropositos,
        ofrendaEmergenciaNacional,
        fondoSolidarioMinisterial,
        totalMiembros,
        masculinos,
        femeninos,
        excluidos,
        trasladados,
      ])
    ) {
      return errors.faltanDatosError();
    }
    const usuario = Token.decodeToken(usuarioToken).usuario;
    //llamamos el procedimiento
    const result = await model.connection.query(
      "call actualizarInformeTesoreroMensual(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
      [
        usuario,
        estado,
        codigoInforme,
        diezmosRecibidosIglesia,
        diezmoEnviadoOficina,
        diezmosEntregadosPastor,
        membresiaPatrimonioHistorico,
        ofrendaMisioneraSegundoDomingo,
        impulsoMisiones,
        porcentajeMisionerosOficina,
        misionesNacionales,
        entradaFondoLocal,
        diezmosFondoLocal,
        fondoRetiroPastoral,
        dineroOtrosPropositos,
        ofrendaEmergenciaNacional,
        fondoSolidarioMinisterial,
        totalMiembros,
        masculinos,
        femeninos,
        excluidos,
        trasladados,
      ]
    );
    console.log(result);
    return result;
  },
};
