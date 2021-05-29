const model = require("../Model");
const comprobations = require("../../helpers/DataComprobations");
const errors = require("../../helpers/OurErrors");
const GeneratorCode = require("../../helpers/GeneratorCode");
const Token = require("../../services/security/Token");

const ID_INFORME_TESORERO_MENSUAL = 1;
const PREFIJO_INFORME = "IF";
const IDENTIFICADOR_INFORME_TESORERO_MENSUAL =
  "695dc21a-fff1-4cbd-8ec1-0f1a1d08c572";
module.exports = {
  createCabeceraInforme: async (data) => {
    //nombreIglesia
    //nombrePastor
    //idUsuario -->usuario_cr
    const {
      estado,
      usuarioToken,
      codigoIglesia,
      nombreTesorero,
      codigoPastor,
      codigoGestion,
      //idInformeMinisterialmensual
    } = data;
    //Comprobamos que los campos sean validos
    if (
      !comprobations.areFieldsValid([
        estado,
        usuarioToken,
        codigoIglesia,
        nombreTesorero,
        codigoPastor,
        codigoGestion,
      ])
    ) {
      return errors.faltanDatosError();
    }
    //generados el codigo
    const codigoInforme = GeneratorCode(PREFIJO_INFORME);
    //Obtenemos el id del usuario del token.
    const usuario = Token.decodeToken(usuarioToken).usuario;

    //llamamos la transaccion
    return await model.multipleTransactionQuery(async (dbConnection) => {
      //consultamos los datos necesarios en caso de fallar alguno se envia error de no encontrado
      const iglesiaResult = await dbConnection.query(
        "select nombre from iglesias where codigo = ?",
        [codigoIglesia]
      );
      if (iglesiaResult.length == 0)
        return errors.datosNoEncontrados("Iglesia no encontrada");
/*       if (gestionAnioResult.length == 0)
        return errors.datosNoEncontrados("Año de gestión no encontrado");
      const gestionMesResult = await dbConnection.query(
        "select MGI.mes, GI.informe, GI.gestion from gestiones as G join gestion_informes as GI on G.codigo = GI.gestion join meses_gestion_informe as MGI on MGI.gestion_informe = GI.id where G.codigo=? AND GI.informe = ?",
        [codigoGestion, ID_INFORME_TESORERO_MENSUAL]
      );
      if (gestionMesResult.length == 0)
        return errors.datosNoEncontrados(
          "Mes del informe para la gestión no encontrado"
        ); */
      const usuarioCodigo = await dbConnection.query(
        "SELECT persona FROM `usuarios` WHERE id = ?",
        [usuario]
      );

      let result;
      if (estado == 2) {
        result = await dbConnection.query(
          "INSERT INTO `informe_financiero_mensual` (`codigo`, `iglesia`, `tesorero`, `nombre_iglesia`, `pastor`, `nombre_pastor`, `gestion`, `mes`, `anio`, `usuario_cr`, fecha_procesado, usuario_procesado) VALUES (?,?,?,?,?,?,?,?,?,?,current_date(),?)",
          [
            codigoInforme,
            codigoIglesia,
            nombreTesorero,
            iglesiaResult[0].nombre,
            codigoPastor,
            pastorResult[0].nombre,
            gestionAnioResult[0].codigo,
            gestionMesResult[0].mes,
            gestionAnioResult[0].anio,
            usuario,
            usuarioCodigo[0].persona,
          ]
        );
      } else {
        result = await dbConnection.query(
          "INSERT INTO `informe_financiero_mensual` (`codigo`, `iglesia`, `tesorero`, `nombre_iglesia`, `pastor`, `nombre_pastor`, `gestion`, `mes`, `anio`, `usuario_cr`) VALUES (?,?,?,?,?,?,?,?,?,?)",
          [
            codigoInforme,
            codigoIglesia,
            nombreTesorero,
            iglesiaResult[0].nombre,
            codigoPastor,
            pastorResult[0].nombre,
            gestionAnioResult[0].codigo,
            gestionMesResult[0].mes,
            gestionAnioResult[0].anio,
            usuario,
          ]
        );
      }

      await saveInformesRecibidos(codigoInforme, usuario, estado);
      result.code = codigoInforme;
      return result;
    });
  },
  createDetalleInforme: async (data) => {
    const {
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
    //llamamos la transaccion
    return await model.multipleTransactionQuery(async (dbConnection) => {
      //Si todo fue encontrado correctamente se procede a guardar la cabecera del informe
      const result = await dbConnection.query(
        "INSERT INTO `detalle_informe_financiero_mensual`( `informe_financiero`,`oficinas_internacionales`, `socios_amip`, `misiones_mundiales`, `tributos_anuales`, `ministro_ordenado`, `pastor_laico`, `fondo_local`, `retiro_pastoral`, `segunda_parte_ofrenda_ministerios`, `fondo_emergencia_nacional`, `misiones_nacionales`, `diezmos_ministros`, `compra_propiedad_nacional`, `construccion_templos_nuevos`, `cotizacion_prestaciones`, `seguro_vida`, `fondo_solidario_ministerial`, `otros`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
        [
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
        ]
      );
      result.code = codigoInforme;
      return result;
    });
  },

  updateDetalleInforme: async (data) => {
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

    //llamamos la transaccion
    return await model.multipleTransactionQuery(async (dbConnection) => {
      if (estado == 2) {
        //Obtenemos el id del usuario del token.
        const usuario = Token.decodeToken(usuarioToken).usuario;
        const usuarioCodigo = await dbConnection.query(
          "SELECT persona FROM `usuarios` WHERE id = ?",
          [usuario]
        );
        await dbConnection.query(
          "update informe_financiero_mensual set fecha_procesado=current_date(), usuario_procesado=?  where codigo = ?",
          [usuarioCodigo[0].persona, codigoInforme]
        );
      }
      await dbConnection.query(
        "UPDATE `informes_recibidos_gestion` SET `estado`= ? WHERE informe_ide = ?",
        [estado, codigoInforme]
      );

      //Si todo fue encontrado correctamente se procede a guardar la cabecera del informe
      const result = await dbConnection.query(
        "UPDATE `detalle_informe_financiero_mensual` SET `oficinas_internacionales`=?,`socios_amip`=?,`misiones_mundiales`=?,`tributos_anuales`=?,`ministro_ordenado`=?,`pastor_laico`=?,`fondo_local`=?,`retiro_pastoral`=?,`segunda_parte_ofrenda_ministerios`=?,`fondo_emergencia_nacional`=?,`misiones_nacionales`=?,`diezmos_ministros`=?,`compra_propiedad_nacional`=?,`construccion_templos_nuevos`=?,`cotizacion_prestaciones`=?,`seguro_vida`=?,`fondo_solidario_ministerial`=?,`otros`=? WHERE informe_financiero = ?",
        [
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
          codigoInforme, //codigo de la cabecera
        ]
      );
      return result;
    });
  },

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
};

async function saveInformesRecibidos(codigoInforme, usuario, estado) {
  return await model.multipleTransactionQuery(async (dbConnection) => {
    const informeData = await dbConnection.query(
      "select gestion, iglesia from informe_financiero_mensual where codigo = ?",
      [codigoInforme]
    );
    const informeTipoData = await dbConnection.query(
      "SELECT tipo_informe, id FROM `maestro_de_informes` WHERE identificador = ?",
      [IDENTIFICADOR_INFORME_TESORERO_MENSUAL]
    );
    const usuarioCodigo = await dbConnection.query(
      "SELECT persona FROM `usuarios` WHERE id = ?",
      [usuario]
    );
    return await dbConnection.query(
      "INSERT INTO `informes_recibidos_gestion`(`gestion`, `iglesia`, `tipo_informe`, `informe_maestro`, `informe_ide`, `estado`, `usuario`) VALUES (?,?,?,?,?,?,?)",
      [
        informeData[0].gestion,
        informeData[0].iglesia,
        informeTipoData[0].tipo_informe,
        informeTipoData[0].id,
        codigoInforme,
        estado,
        usuarioCodigo[0].persona,
      ]
    );
  });
}
