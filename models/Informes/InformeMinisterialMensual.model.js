const model = require("../Model");
const comprobations = require("../../helpers/DataComprobations");
const errors = require("../../helpers/OurErrors");
const GeneratorCode = require("../../helpers/GeneratorCode");
const Token = require("../../services/security/Token");

const prefijoDeInforme = "IM";
module.exports = {
  //SER REMOVIDO //debe usar el del modelo de informe.controller

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
  create: async (data) => {
    const {
      estado,
      usuarioToken,
      codigoIglesia,
      codigoPastor,
      codigoGestion,
      //idInformeMinqwisterialmensual
    } = data.cabecera;
    const {
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
    } = data.detalle;

    if (
      !comprobations.areFieldsValid([
        //Campos de cabecera
        estado,
        usuarioToken,
        codigoIglesia,
        codigoGestion,
        //Campos de detalle
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
    //generados el codigo
    const codigoInforme = GeneratorCode(prefijoDeInforme);
    //Obtenemos el id del usuario del token.
    const usuario = Token.decodeToken(usuarioToken).usuario;
    const result = await model.connection.query(
      `call crearInformeMinisterialMensual(?, ?, ?, ?, ?, ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        usuario,
        codigoPastor,
        codigoGestion,
        codigoIglesia,
        estado,
        codigoInforme,
        //Campos para detalle
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
    console.log("---------");
    console.log(result[0][0].codigoInforme);
    console.log("----------");
    return result[0][0];
  },
  update: async (data) => {
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
    const usuario = Token.decodeToken(usuarioToken).usuario;
    //llamamos el procedimiento
    const result = await model.connection.query(
      "call actualizarInformeMinisterialMensual(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
      [
        usuario,
        estado,
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
    console.log(result);
    return result;
  },
};
