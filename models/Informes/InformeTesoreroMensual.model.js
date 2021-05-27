const model = require("../Model");
const comprobations = require("../../helpers/DataComprobations");
const errors = require("../../helpers/OurErrors");
const GeneratorCode = require("../../helpers/GeneratorCode");
const Token = require("../../services/security/Token");

const ID_INFORME_TESORERO_MENSUAL = 3;
const PREFIJO_INFORME = "IT";
const IDENTIFICADOR_INFORME_TESORERO_MENSUAL =
  "74a9f3a5-6339-488c-8451-e1c190d41a78";
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
      telefono,
      direccion,
      mail,
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
        telefono,
        direccion,
        mail,
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
      const pastorResult = await dbConnection.query(
        "select concat(PER.nombres,' ',PER.apellidos) as nombre from pastores as PAS join personas as PER on PAS.persona = PER.codigo where PAS.codigo = ?",
        [codigoPastor]
      );
      if (pastorResult.length == 0)
        return errors.datosNoEncontrados("Pastor no encontrado");
      const gestionAnioResult = await dbConnection.query(
        "select PM.anio,G.codigo, PM.codigo as periodo from periodo_ministerial as PM JOIN gestiones as G on PM.codigo = G.periodo where G.codigo = ?",
        [codigoGestion]
      );
      if (gestionAnioResult.length == 0)
        return errors.datosNoEncontrados("Año de gestión no encontrado");
      const gestionMesResult = await dbConnection.query(
        "select MGI.mes, GI.informe, GI.gestion from gestiones as G join gestion_informes as GI on G.codigo = GI.gestion join meses_gestion_informe as MGI on MGI.gestion_informe = GI.id where G.codigo=? AND GI.informe = ?",
        [codigoGestion, ID_INFORME_TESORERO_MENSUAL]
      );
      if (gestionMesResult.length == 0)
        return errors.datosNoEncontrados(
          "Mes del informe para la gestión no encontrado"
        );
      const usuarioCodigo = await dbConnection.query(
        "SELECT persona FROM `usuarios` WHERE id = ?",
        [usuario]
      );

      let result;
      if (estado == 2) {
        result = await dbConnection.query(
          "INSERT INTO `informe_mesual_tesorero` (`codigo`, `iglesia`, `tesorero`, `nombre_iglesia`, `pastor`, `nombre_pastor`, `gestion`, `mes`, `anio`, `telefono`, `direccion`, `correo_electronico`, `usuario_cr`, fecha_procesado, usuario_procesado) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,current_date(),?)",
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
            telefono,
            direccion,
            mail,
            usuario,
            usuarioCodigo[0].persona,
          ]
        );
      } else {
        result = await dbConnection.query(
          "INSERT INTO `informe_mesual_tesorero` (`codigo`, `iglesia`, `tesorero`, `nombre_iglesia`, `pastor`, `nombre_pastor`, `gestion`, `mes`, `anio`, `telefono`, `direccion`, `correo_electronico`, `usuario_cr`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)",
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
            telefono,
            direccion,
            mail,
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
      diezmosRecibidosIglesia,
      diezmoEnviadoOficina,
      diezmosEntregadosPastor,
      membresiaPatrimonioHistorico,
      ofrendaMisioneraSegundoDomingo,
      impulsoMisiones,
      porcentajeMisionerosOficina,
      misionesNacionales,
      entradaFondoLocal,
      diezmosfondoLocal,
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
        diezmosfondoLocal,
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
    //llamamos la transaccion
    return await model.multipleTransactionQuery(async (dbConnection) => {
      //Si todo fue encontrado correctamente se procede a guardar la cabecera del informe
      const result = await dbConnection.query(
        "INSERT INTO `detalle_informe_mensual_tesorero`(`informe_mesual_tesorero`, `diezmos_recibidos_iglesia`, `diezmo_enviado_oficina`, `diezmos_entregados_pastor`, `membresia_patrimonio_historico`, `ofrenda_misionera_segundo_domingo`, `impulso_misiones`, `porcentaje_misioneros_oficina`, `misiones_nacionales`, `entrada_fondo_local`, `diezmos_fondo_local`, `fondo_retiro_pastoral`, `dinero_otros_propositos`, `ofrenda_emergencia_nacional`, `fondo_solidario_ministerial`, `total_miembros`, `masculinos`, `femeninos`, `excluidos`, `trasladados`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
        [
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
          diezmosfondoLocal,
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
      result.code = codigoInforme;
      return result;
    });
  },
  updateDetalleInforme: async (data) => {
    const {
      usuarioToken,
      estado,
      codigoInforme, //codigo de la cabecera
      diezmoseRecibidosIglesia,
      diezmoEnviadoOficina,
      diezmosEntregadosPastor,
      membresiaPatrimonioHistorico,
      ofrendaMisioneraSegundoDomingo,
      impulsoMisiones,
      porcentajeMisionerosOficina,
      misionesNacionales,
      entradaFondoLocal,
      diezmosfondoLocal,
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
        diezmoseRecibidosIglesia,
        diezmoEnviadoOficina,
        diezmosEntregadosPastor,
        membresiaPatrimonioHistorico,
        ofrendaMisioneraSegundoDomingo,
        impulsoMisiones,
        porcentajeMisionerosOficina,
        misionesNacionales,
        entradaFondoLocal,
        diezmosfondoLocal,
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
          "update informe_mesual_tesorero set fecha_procesado=current_date(), usuario_procesado=?  where codigo = ?",
          [usuarioCodigo[0].persona, codigoInforme]
        );
      }
      await dbConnection.query(
        "UPDATE `informes_recibidos_gestion` SET `estado`= ? WHERE informe_ide = ?",
        [estado, codigoInforme]
      );

      //Si todo fue encontrado correctamente se procede a guardar la cabecera del informe
      const result = await dbConnection.query(
        "UPDATE `detalle_informe_mensual_tesorero` SET `diezmos_recibidos_iglesia`=?,`diezmo_enviado_oficina`=?,`diezmos_entregados_pastor`=?,`membresia_patrimonio_historico`=?,`ofrenda_misionera_segundo_domingo`=?,`impulso_misiones`=?,`porcentaje_misioneros_oficina`=?,`misiones_nacionales`=?,`entrada_fondo_local`=?,`diezmos_fondo_local`=?,`fondo_retiro_pastoral`=?,`dinero_otros_propositos`=?,`ofrenda_emergencia_nacional`=?,`fondo_solidario_ministerial`=?,`total_miembros`=?,`masculinos`=?,`femeninos`=?,`excluidos`=?,`trasladados`=? WHERE `informe_mesual_tesorero` = ?",
        [
          diezmoseRecibidosIglesia,
          diezmoEnviadoOficina,
          diezmosEntregadosPastor,
          membresiaPatrimonioHistorico,
          ofrendaMisioneraSegundoDomingo,
          impulsoMisiones,
          porcentajeMisionerosOficina,
          misionesNacionales,
          entradaFondoLocal,
          diezmosfondoLocal,
          fondoRetiroPastoral,
          dineroOtrosPropositos,
          ofrendaEmergenciaNacional,
          fondoSolidarioMinisterial,
          totalMiembros,
          masculinos,
          femeninos,
          excluidos,
          trasladados,
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
};

async function saveInformesRecibidos(codigoInforme, usuario, estado) {
  return await model.multipleTransactionQuery(async (dbConnection) => {
    const informeData = await dbConnection.query(
      "select gestion, iglesia from informe_mesual_tesorero where codigo = ?",
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
