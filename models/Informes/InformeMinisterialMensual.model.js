const model = require("../Model");
const comprobations = require("../../helpers/DataComprobations");
const errors = require("../../helpers/OurErrors");
const GeneratorCode = require("../../helpers/GeneratorCode");
const Token = require("../../services/security/Token");

const idInformeMinisterialmensual = 2;
const prefijoDeInforme = "I";
module.exports = {
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
        [codigoGestion, idInformeMinisterialmensual]
      );
      if (gestionMesResult.length == 0)
        return errors.datosNoEncontrados(
          "Mes del informe para la gestión no encontrado"
        );
      //Si todo fue encontrado correctamente se procede a guardar la cabecera del informe
      const result = await dbConnection.query(
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
          estado
        ]
      );
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
      diezmosIncluidosInforme
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
        diezmosIncluidosInforme
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
          diezmosIncluidosInforme
        ]
      );
      result.code = codigoInforme;
      return result;
    });
  },
  updateDetalleInforme: async (data) => {
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
      estado,
      diezmosIncluidosInforme
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
        estado,
        diezmosIncluidosInforme
      ])
    ) {
      return errors.faltanDatosError();
    }
    //llamamos la transaccion
    return await model.multipleTransactionQuery(async (dbConnection) => {
      //Si todo fue encontrado correctamente se procede a guardar la cabecera del informe

      await dbConnection.query("UPDATE `informe_ministerial_mensual` SET `estado`= ? WHERE codigo = ?",[estado, codigoInforme]);
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
          codigoInforme
          
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
        "SELECT `mensajes`, `convertidos`, `santificados`, `bautismos_agua`, `bautismos_es`, `agregados`, `hogares_miembros_v`, `hogares_prospectos_v`, `diezmo_recibido`, `diezmo_pagado`, `ofrenda_recibida`, `gastos_ministeriales`, `actividades_oracion`, `vida_oracion`, `actividades_misiones`, `actividades_liderazgo`, `liderez_involucrados`, `mejora_ministerial`, `miembros_activos`, `miembros_salvos`, `miembros_santificados`, `miembros_bautizados_es`, `promedio_asistencia_adultos`, `promedio_asitencia_ni_jov`, `ministerio_alcance_semanal`, `santa_cena`, `lavatorio`, `codigo`, `iglesia`, `nombre_iglesia`, `pastor`, `nombre_pastor`, DATE_FORMAT(IMM.fecha_procesado,'%d/%m/%Y') as  `fecha_procesado`, `usuario_procesado`, `gestion`, `mes`, `anio`, `usuario_cr`, `estado`, DATE_FORMAT(IMM.fecha_cr,'%d/%m/%Y') as `fecha_cr`, DATE_FORMAT(IMM.fecha_uac,'%d/%m/%Y')as `fecha_uac` FROM `detalle_informe_ministerial_mensual` as DIMM join informe_ministerial_mensual as IMM on DIMM.informe_ministerial = IMM.codigo where IMM.codigo = ?",
        [codigoInforme]
      );
    });
  },
  
  template: async (data) => {},
};
