const model = require("../Model");
const comprobations = require("../../helpers/DataComprobations");
const errors = require("../../helpers/OurErrors");
const GeneratorCode = require("../../helpers/GeneratorCode");
const Token = require("../../services/security/Token");

const PREFIJO_INFORME = "IF";
module.exports = {
  getInfoByCodigo: async (codigoInforme) => {
    if (!comprobations.areFieldsValid([codigoInforme])) {
      return errors.faltanDatosError();
    }

    return await model.multipleTransactionQuery(async (dbConnection) => {
      return dbConnection.query(
        `
        SELECT oficinas_internacionales as oficinas_internacionales, 
        socios_amip as sociosAmip, 
        misiones_mundiales as misionesMundiales, 
        tributos_anuales as tributosAnuales, 
        ministro_ordenado as ministroOrdenado, 
        pastor_laico as pastorLaico, 
        fondo_local as fondoLocal, 
        retiro_pastoral as retiroPastoral, 
        segunda_parte_ofrenda_ministerios as segundaParteOfrendaMinisterios, 
        fondo_emergencia_nacional as fondoEmergenciaNacional, 
        misiones_nacionales as misionesNacionales, 
        diezmos_ministros as diezmosMinistros, 
        compra_propiedad_nacional as compraPropiedadNacional, 
        construccion_templos_nuevos as construccionTemplosNuevos, 
        cotizacion_prestaciones as cotizacionPrestaciones, 
        seguro_vida as seguroVida, 
        fondo_solidario_ministerial as fondoSolidarioMinisterial, 
        otros FROM detalle_informe_financiero_mensual WHERE informe_financiero = ?
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
      //idInformeMinisterialmensual
    } = data.cabecera;
    const {
      oficinasInternacionales,
      sociosAmip,
      misionesMundiales,
      tributosAnuales,
      ministroOrdenado,
      pastorLaico,
      fondoLocal,
      retiroPastoral,
      segundaParteOfrendaministerios,
      fondoEmergenciaNacional,
      misionesNacionales,
      diezmosMinistros,
      compraPropiedadNacional,
      construccionTemplosNuevos,
      cotizacionPrestaciones,
      seguroVida,
      fondoSolidarioMinisterial,
      otros,
    } = data.detalle;

    if (
      !comprobations.areFieldsValid([
        //Campos de cabecera
        estado,
        usuarioToken,
        codigoIglesia,
        nombreTesorero,
        codigoGestion,
        //Campos de detalle
        oficinasInternacionales,
        sociosAmip,
        misionesMundiales,
        tributosAnuales,
        ministroOrdenado,
        pastorLaico,
        fondoLocal,
        retiroPastoral,
        segundaParteOfrendaministerios,
        fondoEmergenciaNacional,
        misionesNacionales,
        diezmosMinistros,
        compraPropiedadNacional,
        construccionTemplosNuevos,
        cotizacionPrestaciones,
        seguroVida,
        fondoSolidarioMinisterial,
        otros,
      ])
    ) {
      return errors.faltanDatosError();
    }
    //generados el codigo
    const codigoInforme = GeneratorCode(PREFIJO_INFORME);
    //Obtenemos el id del usuario del token.
    const usuario = Token.decodeToken(usuarioToken).usuario;
    const result = await model.connection.query(
      `call crearInformeFinancieroMensual(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        usuario,
        codigoPastor,
        codigoGestion,
        codigoIglesia,
        estado,
        codigoInforme,
        nombreTesorero,
        //Campos para detalle
        oficinasInternacionales,
        sociosAmip,
        misionesMundiales,
        tributosAnuales,
        ministroOrdenado,
        pastorLaico,
        fondoLocal,
        retiroPastoral,
        segundaParteOfrendaministerios,
        fondoEmergenciaNacional,
        misionesNacionales,
        diezmosMinistros,
        compraPropiedadNacional,
        construccionTemplosNuevos,
        cotizacionPrestaciones,
        seguroVida,
        fondoSolidarioMinisterial,
        otros,
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
      oficinasInternacionales,
      sociosAmip,
      misionesMundiales,
      tributosAnuales,
      ministroOrdenado,
      pastorLaico,
      fondoLocal,
      retiroPastoral,
      segundaParteOfrendaministerios,
      fondoEmergenciaNacional,
      misionesNacionales,
      diezmosMinistros,
      compraPropiedadNacional,
      construccionTemplosNuevos,
      cotizacionPrestaciones,
      seguroVida,
      fondoSolidarioMinisterial,
      otros,
    } = data;
    if (
      !comprobations.areFieldsValid([
        usuarioToken,
        estado,
        codigoInforme, //codigo de la cabecera
        oficinasInternacionales,
        sociosAmip,
        misionesMundiales,
        tributosAnuales,
        ministroOrdenado,
        pastorLaico,
        fondoLocal,
        retiroPastoral,
        segundaParteOfrendaministerios,
        fondoEmergenciaNacional,
        misionesNacionales,
        diezmosMinistros,
        compraPropiedadNacional,
        construccionTemplosNuevos,
        cotizacionPrestaciones,
        seguroVida,
        fondoSolidarioMinisterial,
        otros,
      ])
    ) {
      return errors.faltanDatosError();
    }
    const usuario = Token.decodeToken(usuarioToken).usuario;
    //llamamos el procedimiento
    const result = await model.connection.query(
      "call actualizarInformeFinancieroMensual(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
      [
        usuario,
        estado,
        codigoInforme,
        oficinasInternacionales,
        sociosAmip,
        misionesMundiales,
        tributosAnuales,
        ministroOrdenado,
        pastorLaico,
        fondoLocal,
        retiroPastoral,
        segundaParteOfrendaministerios,
        fondoEmergenciaNacional,
        misionesNacionales,
        diezmosMinistros,
        compraPropiedadNacional,
        construccionTemplosNuevos,
        cotizacionPrestaciones,
        seguroVida,
        fondoSolidarioMinisterial,
        otros,
      ]
    );
    console.log(result);
    return result;
  },
};
