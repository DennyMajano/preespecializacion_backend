const model = require("../Model");
const comprobations = require("../../helpers/DataComprobations");
const errors = require("../../helpers/OurErrors");
const GeneratorCode = require("../../helpers/GeneratorCode");
const Token = require("../../services/security/Token");

const idInformeMinisterialmensual = 2;
const prefijoDeInforme = "IM";
const IDENTIFICADOR_INFORME_MINISTERIAL_MENSUAL =
  "51ae4740-172b-4242-aa65-8244aa374141";
module.exports = {
  //SER REMOVIDO //debe usar el del modelo de informe.controller
  SetProcesado: async (codigoInforme, usuarioToken) => {
    if (!comprobations.areFieldsValid([codigoInforme, usuarioToken])) {
      return errors.faltanDatosError();
    }const usuario = Token.decodeToken(usuarioToken).usuario;
    return await model.multipleTransactionQuery(async (dbConnection)=>{
      
    const usuarioCodigo = await dbConnection.query(
      "SELECT persona FROM `usuarios` WHERE id = ?",
      [usuario]
    );
    await dbConnection.query(
      "update informe_ministerial_mensual set estado = 2, usuario_procesado=?, fecha_procesado=current_date() where codigo = ?",
      [usuarioCodigo[0].persona,codigoInforme]
    );

    return await dbConnection.query("update informes_recibidos_gestion set estado = 2 where informe_ide=?",[codigoInforme]);
    });
  },
  createCabeceraInforme: async (data) => {
    //nombreIglesia
    //nombrePastor
    //idUsuario -->usuario_cr
    const {
      estado,
      usuarioToken,
      codigoIglesia,
      codigoPastor,
      codigoGestion,
      //idInformeMinisterialmensual
    } = data;
    console.log([usuarioToken, codigoIglesia, codigoPastor, codigoGestion]);
    //Comprobamos que los campos sean validos
    if (
      !comprobations.areFieldsValid([
        estado,
        usuarioToken,
        codigoIglesia,
        codigoPastor,
        codigoGestion,
      ])
    ) {
      return errors.faltanDatosError();
    }
    //generados el codigo
    const codigoInforme = GeneratorCode(prefijoDeInforme);
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
      const gestionAnioResult = await dbConnection.query(
        "select PM.anio,G.codigo, PM.codigo as periodo from periodo_ministerial as PM JOIN gestiones as G on PM.codigo = G.periodo where G.codigo = ?",
        [codigoGestion]
      );
      if (gestionAnioResult.length == 0)
        return errors.datosNoEncontrados("Año de gestión no encontrado");
      const gestionMesResult = await dbConnection.query(
        "select MGI.mes, GI.informe, GI.gestion from gestiones as G join gestion_informes as GI on G.codigo = GI.gestion join meses_gestion_informe as MGI on MGI.gestion_informe = GI.id where G.codigo=? AND GI.informe = ?",
        [codigoGestion, idInformeMinisterialmensual]
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
        //Si entra aqui esque esta procesado se debe actualizar fecha procesado y usuario procesado
        result = await dbConnection.query(
          "INSERT INTO `informe_ministerial_mensual`(`codigo`, `iglesia`, `nombre_iglesia`, `pastor`, `nombre_pastor`, `gestion`, `mes`, `anio`, `usuario_cr`, estado, fecha_procesado, usuario_procesado  ) VALUES (?,?,?,?,?,?,?,?,?,?,current_date(),?)",
          [
            codigoInforme,
            codigoIglesia,
            iglesiaResult[0].nombre,
            codigoPastor,
            pastorResult[0].nombre,
            gestionAnioResult[0].codigo,
            gestionMesResult[0].mes,
            gestionAnioResult[0].anio,
            usuarioCodigo[0].persona,
            estado,
            usuarioCodigo[0].persona,
          ]
        );
      } else {
        //Si todo fue encontrado correctamente se procede a guardar la cabecera del informe
        result = await dbConnection.query(
          "INSERT INTO `informe_ministerial_mensual`(`codigo`, `iglesia`, `nombre_iglesia`, `pastor`, `nombre_pastor`, `gestion`, `mes`, `anio`, `usuario_cr`, estado) VALUES (?,?,?,?,?,?,?,?,?,?)",
          [
            codigoInforme,
            codigoIglesia,
            iglesiaResult[0].nombre,
            codigoPastor,
            pastorResult[0].nombre,
            gestionAnioResult[0].codigo,
            gestionMesResult[0].mes,
            gestionAnioResult[0].anio,
            usuario,
            estado,
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
      codigoInforme,
      mensajes,
      convertidos,
      santificados,
      bautismosAgua,
      bautismosEs,
      agregados,
      hogaresMiembrosV,
      hogaresProspectosV,
      diezmoRecibido,
      diezmoPagado,
      ofrendaRecibida,
      gastosMinisteriales,
      actividadesOracion,
      vidaOracion,
      actividadesMisiones,
      actividadesLiderazgo,
      lideresInvolucrados,
      mejoraMinisterial,
      miembrosActivos,
      miembrosSalvos,
      miembrosSantificados,
      miembrosBautizadosEs,
      promedioAsistenciaAdultos,
      promedioAsistenciaNiJov,
      ministerioAlcanceSemanal,
      santaCena,
      lavatorios,
      diezmosIncluidosInforme,
    } = data;
    if (
      !comprobations.areFieldsValid([
        codigoInforme,
        mensajes,
        convertidos,
        santificados,
        bautismosAgua,
        bautismosEs,
        agregados,
        hogaresMiembrosV,
        hogaresProspectosV,
        diezmoRecibido,
        diezmoPagado,
        ofrendaRecibida,
        gastosMinisteriales,
        actividadesOracion,
        vidaOracion,
        actividadesMisiones,
        actividadesLiderazgo,
        lideresInvolucrados,
        mejoraMinisterial,
        miembrosActivos,
        miembrosSalvos,
        miembrosSantificados,
        miembrosBautizadosEs,
        promedioAsistenciaAdultos,
        promedioAsistenciaNiJov,
        ministerioAlcanceSemanal,
        santaCena,
        lavatorios,
        diezmosIncluidosInforme,
      ])
    ) {
      return errors.faltanDatosError();
    }
    //llamamos la transaccion
    return await model.multipleTransactionQuery(async (dbConnection) => {
      //Si todo fue encontrado correctamente se procede a guardar la cabecera del informe
      const result = await dbConnection.query(
        "INSERT INTO `detalle_informe_ministerial_mensual`(`informe_ministerial`, `mensajes`, `convertidos`, `santificados`, `bautismos_agua`, `bautismos_es`, `agregados`, `hogares_miembros_v`, `hogares_prospectos_v`, `diezmo_recibido`, `diezmo_pagado`, `ofrenda_recibida`, `gastos_ministeriales`, `actividades_oracion`, `vida_oracion`, `actividades_misiones`, `actividades_liderazgo`, `liderez_involucrados`, `mejora_ministerial`, `miembros_activos`, `miembros_salvos`, `miembros_santificados`, `miembros_bautizados_es`, `promedio_asistencia_adultos`, `promedio_asitencia_ni_jov`, `ministerio_alcance_semanal`, `santa_cena`, `lavatorio`, `diezmos_incluidos_informe`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
        [
          codigoInforme,
          mensajes,
          convertidos,
          santificados,
          bautismosAgua,
          bautismosEs,
          agregados,
          hogaresMiembrosV,
          hogaresProspectosV,
          diezmoRecibido,
          diezmoPagado,
          ofrendaRecibida,
          gastosMinisteriales,
          actividadesOracion,
          vidaOracion,
          actividadesMisiones,
          actividadesLiderazgo,
          lideresInvolucrados,
          mejoraMinisterial,
          miembrosActivos,
          miembrosSalvos,
          miembrosSantificados,
          miembrosBautizadosEs,
          promedioAsistenciaAdultos,
          promedioAsistenciaNiJov,
          ministerioAlcanceSemanal,
          santaCena,
          lavatorios,
          diezmosIncluidosInforme,
        ]
      );
      result.code = codigoInforme;
      return result;
    });
  },

  getInfoByCodigo: async (codigoInforme) => {
    if (!comprobations.areFieldsValid([codigoInforme])) {
      return errors.faltanDatosError();
    }

    return await model.multipleTransactionQuery(async (dbConnection) => {
      let informeData = await dbConnection.query(
        "SELECT `diezmos_incluidos_informe`,`mensajes`, `convertidos`, `santificados`, `bautismos_agua`, `bautismos_es`, `agregados`, `hogares_miembros_v`, `hogares_prospectos_v`, `diezmo_recibido`, `diezmo_pagado`, `ofrenda_recibida`, `gastos_ministeriales`, `actividades_oracion`, `vida_oracion`, `actividades_misiones`, `actividades_liderazgo`, `liderez_involucrados`, `mejora_ministerial`, `miembros_activos`, `miembros_salvos`, `miembros_santificados`, `miembros_bautizados_es`, `promedio_asistencia_adultos`, `promedio_asitencia_ni_jov`, `ministerio_alcance_semanal`, `santa_cena`, `lavatorio`, `codigo`, `iglesia`, `nombre_iglesia`, `pastor`, `nombre_pastor`, DATE_FORMAT(IMM.fecha_procesado,'%d/%m/%Y') as  `fecha_procesado`, `usuario_procesado`, `gestion`, `mes`, `anio`, `usuario_cr`, `estado`, DATE_FORMAT(IMM.fecha_cr,'%d/%m/%Y') as `fecha_cr`, DATE_FORMAT(IMM.fecha_uac,'%d/%m/%Y')as `fecha_uac` FROM `detalle_informe_ministerial_mensual` as DIMM join informe_ministerial_mensual as IMM on DIMM.informe_ministerial = IMM.codigo where IMM.codigo = ?",
        [codigoInforme]
      );
      informeData = informeData[0];
      console.log(informeData);
      let informeFinal = {
        mensajes: informeData.mensajes,
        convertidos: informeData.convertidos,
        santificados: informeData.santificados,
        bautismosAgua: informeData.bautismos_agua,
        bautismosEs: informeData.bautismos_es,
        agregados: informeData.agregados,
        hogaresMiembrosV: informeData.hogares_miembros_v,
        hogaresProspectosV: informeData.hogares_prospectos_v,
        diezmoRecibido: informeData.diezmo_recibido,
        diezmoPagado: informeData.diezmo_pagado,
        ofrendaRecibida: informeData.ofrenda_recibida,
        diezmosIncluidosInforme: informeData.diezmos_incluidos_informe,
        gastosMinisteriales: informeData.gastos_ministeriales,
        actividadesOracion: informeData.actividades_oracion,
        //es bool  `promedio_asistencia_adultos
        vidaOracion: informeData.vida_oracion,
        actividadesMisiones: informeData.actividades_misiones,
        actividadesLiderazgo: informeData.actividades_liderazgo,
        lideresInvolucrados: informeData.liderez_involucrados,
        //es bool
        mejoraMinisterial: informeData.mejora_ministerial,
        miembrosActivos: informeData.miembros_activos,
        miembrosSalvos: informeData.miembros_salvos,
        miembrosSantificados: informeData.miembros_santificados,
        miembrosBautizadosEs: informeData.miembros_bautizados_es,
        promedioAsistenciaAdultos: informeData.promedio_asistencia_adultos,
        promedioAsistenciaNiJov: informeData.promedio_asitencia_ni_jov,
        //es bool
        ministerioAlcanceSemanal: informeData.ministerio_alcance_semanal,
        santaCena: informeData.santa_cena,
        lavatorios: informeData.lavatorio,
        codigo: informeData.codigo,
        iglesia: informeData.iglesia,
        nombreIglesia: informeData.nombre_iglesia,
        pastor: informeData.pastor,
        nombrePastor: informeData.nombre_pastor,
        fechaProcesado: informeData.fecha_procesado,
        usuarioProcesado: informeData.usuario_procesado,
        gestion: informeData.gestion,
        mes: informeData.mes,
        anio: informeData.anio,
        usuarioCreo: informeData.usuario_cr,
        estado: informeData.estado,
        fechaCr: informeData.fecha_cr,
        fechaUac: informeData.fecha_uac,
      };

      return informeFinal;
    });
  },
  updateDetalleInforme: async (data) => {
    const {
      usuarioToken,
      codigoInforme,
      mensajes,
      convertidos,
      santificados,
      bautismosAgua,
      bautismosEs,
      agregados,
      hogaresMiembrosV,
      hogaresProspectosV,
      diezmoRecibido,
      diezmoPagado,
      ofrendaRecibida,
      gastosMinisteriales,
      actividadesOracion,
      vidaOracion,
      actividadesMisiones,
      actividadesLiderazgo,
      lideresInvolucrados,
      mejoraMinisterial,
      miembrosActivos,
      miembrosSalvos,
      miembrosSantificados,
      miembrosBautizadosEs,
      promedioAsistenciaAdultos,
      promedioAsistenciaNiJov,
      ministerioAlcanceSemanal,
      santaCena,
      lavatorios,
      estado,
      diezmosIncluidosInforme,
    } = data;
    if (
      !comprobations.areFieldsValid([
        usuarioToken,
        codigoInforme,
        mensajes,
        convertidos,
        santificados,
        bautismosAgua,
        bautismosEs,
        agregados,
        hogaresMiembrosV,
        hogaresProspectosV,
        diezmoRecibido,
        diezmoPagado,
        ofrendaRecibida,
        gastosMinisteriales,
        actividadesOracion,
        vidaOracion,
        actividadesMisiones,
        actividadesLiderazgo,
        lideresInvolucrados,
        mejoraMinisterial,
        miembrosActivos,
        miembrosSalvos,
        miembrosSantificados,
        miembrosBautizadosEs,
        promedioAsistenciaAdultos,
        promedioAsistenciaNiJov,
        ministerioAlcanceSemanal,
        santaCena,
        lavatorios,
        estado,
        diezmosIncluidosInforme,
      ])
    ) {
      return errors.faltanDatosError();
    }

    //llamamos la transaccion
    return await model.multipleTransactionQuery(async (dbConnection) => {
      //Si todo fue encontrado correctamente se procede a guardar la cabecera del informe

      await dbConnection.query(
        "UPDATE `informe_ministerial_mensual` SET `estado`= ? WHERE codigo = ?",
        [estado, codigoInforme]
      );
      if(estado == 2){
            //Obtenemos el id del usuario del token.
        const usuario = Token.decodeToken(usuarioToken).usuario;
        const usuarioCodigo = await dbConnection.query(
          "SELECT persona FROM `usuarios` WHERE id = ?",
          [usuario]
        );
        await dbConnection.query(
          "UPDATE `informes_recibidos_gestion` SET `estado`= 2 WHERE informe_ide = ?",
          [codigoInforme]
        );
        await dbConnection.query(
          "update informe_ministerial_mensual set fecha_procesado=current_date(), usuario_procesado=?, estado = 2  where codigo = ?",
          [usuarioCodigo[0].persona, codigoInforme]
        );
      }
      else{
        await dbConnection.query(
          "UPDATE `informes_recibidos_gestion` SET `estado`= ? WHERE informe_ide = ?",
          [estado, codigoInforme]
        );
        await dbConnection.query(
          "update informe_ministerial_mensual set estado = 1  where codigo = ?",
          [ codigoInforme]
        );
      }
      const result = await dbConnection.query(
        "UPDATE `detalle_informe_ministerial_mensual` SET `mensajes`=?,`convertidos`=?,`santificados`=?,`bautismos_agua`=?,`bautismos_es`=?,`agregados`=?,`hogares_miembros_v`=?,`hogares_prospectos_v`=?,`diezmo_recibido`=?,`diezmo_pagado`=?,`ofrenda_recibida`=?,`gastos_ministeriales`=?,`actividades_oracion`=?,`vida_oracion`=?,`actividades_misiones`=?,`actividades_liderazgo`=?,`liderez_involucrados`=?,`mejora_ministerial`=?,`miembros_activos`=?,`miembros_salvos`=?,`miembros_santificados`=?,`miembros_bautizados_es`=?,`promedio_asistencia_adultos`=?,`promedio_asitencia_ni_jov`=?,`ministerio_alcance_semanal`=?,`santa_cena`=?,`lavatorio`=?, `diezmos_incluidos_informe` = ? WHERE `informe_ministerial` = ?",
        [
          mensajes,
          convertidos,
          santificados,
          bautismosAgua,
          bautismosEs,
          agregados,
          hogaresMiembrosV,
          hogaresProspectosV,
          diezmoRecibido,
          diezmoPagado,
          ofrendaRecibida,
          gastosMinisteriales,
          actividadesOracion,
          vidaOracion,
          actividadesMisiones,
          actividadesLiderazgo,
          lideresInvolucrados,
          mejoraMinisterial,
          miembrosActivos,
          miembrosSalvos,
          miembrosSantificados,
          miembrosBautizadosEs,
          promedioAsistenciaAdultos,
          promedioAsistenciaNiJov,
          ministerioAlcanceSemanal,
          santaCena,
          lavatorios,
          diezmosIncluidosInforme,
          codigoInforme,
        ]
      );
      return result;
    });
  },
  template: async (data) => {},
};

async function saveInformesRecibidos(codigoInforme, usuario, estado) {
  return await model.multipleTransactionQuery(async (dbConnection) => {
    await dbConnection.query(
      "update informe_ministerial_mensual set estado = 2 where codigo = ?",
      [codigoInforme]
    );
    const informeData = await dbConnection.query(
      "select gestion, iglesia from informe_ministerial_mensual where codigo = ?",
      [codigoInforme]
    );
    const informeTipoData = await dbConnection.query(
      "SELECT tipo_informe, id FROM `maestro_de_informes` WHERE identificador = ?",
      [IDENTIFICADOR_INFORME_MINISTERIAL_MENSUAL]
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

