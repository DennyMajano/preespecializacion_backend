const model = require("../Model");
const comprobations = require("../../helpers/DataComprobations");
const errors = require("../../helpers/OurErrors");
const GeneratorCode = require("../../helpers/GeneratorCode");
const Token = require("../../services/security/Token");

module.exports = {
  create: async (data) => {
    const {
      usuarioToken,
      descripcion,
      tipo,
      fechaRecibirInicio,
      fechaRecibirFin,
      periodo,
    } = data;
    console.log(data);
    console.log("----");
    //Comprobamos que los campos sean validos
    if (
      !comprobations.areFieldsValid([
        usuarioToken,
        descripcion,
        tipo,
        fechaRecibirInicio,
        fechaRecibirFin,
        periodo,
      ])
    ) {
      return errors.faltanDatosError();
    }
    //generados el codigo
    const codigoGestion = GeneratorCode("GE");
    //Obtenemos el id del usuario del token.
    const usuario = Token.decodeToken(usuarioToken).usuario;

    //llamamos la transaccion
    return await model.multipleTransactionQuery(async (dbConnection) => {
      const result = await dbConnection.query(
        "INSERT INTO `gestiones`(`codigo`, `descripcion`, `tipo_gestion`,`usuario_cr`,`fecha_recibir_inicio`, `fecha_recibir_fin`, `periodo`) VALUES (?,?,?,?,?,?,?)",
        //"INSERT INTO `gestiones`(`codigo`, `descripcion`, `tipo_gestion`,`usuario_cr`,`fecha_recibir_fin`, `periodo`) VALUES (?,?,?,?,?,?)",
        [
          codigoGestion,
          descripcion,
          tipo,
          usuario,
          fechaRecibirInicio,
          fechaRecibirFin + " 23:59:00",
          periodo,
        ]
      );
      result.code = codigoGestion;
      return result;
    });
  },
  update: async (data) => {
    const {
      usuarioToken,
      codigoGestion,
      descripcion,
      tipo,
      fechaRecibirFin,
      fechaRecibirInicio,
    } = data;
    if (
      !comprobations.areFieldsValid([
        usuarioToken,
        descripcion,
        tipo,
        fechaRecibirFin,
        fechaRecibirInicio,
      ])
    ) {
      return errors.faltanDatosError();
    }
    //Obtenemos el id del usuario del token.
    const usuario = Token.decodeToken(usuarioToken).usuario;

    //llamamos la transaccion
    return await model.multipleTransactionQuery(async (dbConnection) => {
      const result = await dbConnection.query(
        // "INSERT INTO `gestiones`(`codigo`, `descripcion`, `tipo_gestion`,`usuario_cr`,`fecha_recibir_inicio`, `fecha_recibir_fin`, `periodo`) VALUES (?,?,?,?,?,?,?)",
        "UPDATE `gestiones` SET `descripcion`=?,`tipo_gestion`=?,`usuario_uac`=?,`fecha_recibir_inicio`=?,`fecha_recibir_fin`=? WHERE `codigo` = ?",
        [
          descripcion,
          tipo,
          usuario,
          fechaRecibirInicio,
          fechaRecibirFin + " 23:59:00",
          codigoGestion,
        ]
      );
      return result;
    });
  },
  delete: async (codigoGestion) => {
    if (!comprobations.areFieldsValid([codigoGestion])) {
      return errors.faltanDatosError();
    }
    return await model.multipleTransactionQuery(async (dbConnection) => {
      return dbConnection.query(
        "delete from gestiones where codigo = ? or id =?",
        [codigoGestion, codigoGestion]
      );
    });
  },
  deleteAsignacionInforme: async (data) => {
    const { codigoGestion, idGestionInforme } = data;
    if (!comprobations.areFieldsValid([codigoGestion, idGestionInforme])) {
      return errors.faltanDatosError();
    }

    return await model.multipleTransactionQuery(async (dbConnection) => {
      return await dbConnection.query(
        "DELETE FROM gestion_informes WHERE id = ? AND gestion = ?",
        [idGestionInforme, codigoGestion]
      );
    });
  },
  getByCodigoOrId: async (codigoGestion) => {
    if (!comprobations.areFieldsValid([codigoGestion])) {
      return errors.faltanDatosError();
    }

    return await model.multipleTransactionQuery(async (dbConnection) => {
      return dbConnection.query(
        "select id, codigo,descripcion, tipo_gestion as tipo_gestion_id, (select nombre from tipo_gestiones where id = gestiones.tipo_gestion) as tipo_gestion_name, estado, DATE_FORMAT(fecha_publicacion,'%d/%m/%Y') as fecha_publicacion,DATE_FORMAT(fecha_recibir_inicio,'%d/%m/%Y') as fecha_recibir_inicio, DATE_FORMAT(fecha_recibir_fin,'%d/%m/%Y') as fecha_recibir_fin from gestiones WHERE codigo = ? or id =?",
        [codigoGestion, codigoGestion]
      );
    });
  },
  getGestionesActivas: async () => {
    return await model.multipleTransactionQuery(async (dbConnection) => {
      return await dbConnection.query(
        "select id, codigo, descripcion, (select nombre from tipo_gestiones where id = gestiones.tipo_gestion) as tipo_gestion_name, estado, DATE_FORMAT(fecha_publicacion,'%d/%m/%Y') as fecha_publicacion,DATE_FORMAT(fecha_recibir_inicio,'%d/%m/%Y %r') as fecha_recibir_inicio, DATE_FORMAT(fecha_recibir_fin,'%d/%m/%Y %r') as fecha_recibir_fin, DATE_FORMAT(fecha_cr,'%d/%m/%Y %r') as fecha_cr from gestiones where estado = 2"
      );
    });
  },
  getGestionesInactivas: async () => {
    return await model.multipleTransactionQuery(async (dbConnection) => {
      return await dbConnection.query(
        "select id, codigo, descripcion, (select nombre from tipo_gestiones where id = gestiones.tipo_gestion) as tipo_gestion_name, estado, DATE_FORMAT(fecha_publicacion,'%d/%m/%Y %r') as fecha_publicacion,DATE_FORMAT(fecha_recibir_inicio,'%d/%m/%Y %r') as fecha_recibir_inicio, DATE_FORMAT(fecha_recibir_fin,'%d/%m/%Y %r') as fecha_recibir_fin,  DATE_FORMAT(fecha_cr,'%d/%m/%Y %r') as fecha_cr from gestiones where estado = 1"
      );
    });
  },
  getInformesAsignados: async (codigoGestion) => {
    if (!comprobations.areFieldsValid([codigoGestion])) {
      return errors.faltanDatosError();
    }
    return await model.multipleTransactionQuery(async (dbConnection) => {
      return await dbConnection.query(
        "select informe as informe_id, (select nombre from maestro_de_informes where id = informe) as informe_nombre, mes as mes_id, (select nombre from meses where id = MGI.mes) as mes_nombre, gestion_informe, DATE_FORMAT(fecha_agregacion,'%d/%m/%Y %r') as fecha_agregacion from gestion_informes as GI join meses_gestion_informe as MGI on GI.id = MGI.gestion_informe join gestiones as G on G.codigo = GI.gestion  where GI.gestion = ?  OR G.id = ?",
        [codigoGestion, codigoGestion]
      );
    });
  },
  asignarInforme: async (data) => {
    const { codigoGestion, informeId, mesId } = data;
    if (!comprobations.areFieldsValid([codigoGestion, informeId, mesId])) {
      return errors.faltanDatosError();
    }

    return await model.multipleTransactionQuery(async (dbConnection) => {
      const verificacionInformeDuplicados = await dbConnection.query(
        "select informe,mes from gestion_informes as GI join meses_gestion_informe MGI on GI.id = MGI.gestion_informe where MGI.mes = ? AND GI.informe = ? AND GI.gestion=?",
        [mesId, informeId, codigoGestion]
      );

      if (verificacionInformeDuplicados.length > 0) {
        return errors.requerimientosNoPasados();
      }

      const gestionInformeResult = await dbConnection.query(
        "INSERT INTO `gestion_informes`(`gestion`, `informe`) VALUES (?,?)",
        [codigoGestion, informeId]
      );

      const mesesGestionInformeResult = await dbConnection.query(
        "INSERT INTO `meses_gestion_informe`(`mes`, `gestion_informe`) VALUES (?,?)",
        [mesId, gestionInformeResult.insertId]
      );
      return gestionInformeResult;
    });
  },
  getIglesiasQueHanReportado: async (codigoGestion) => {
    if (!comprobations.areFieldsValid([codigoGestion])) {
      return errors.faltanDatosError();
    }

    return await model.multipleTransactionQuery(async (dbConnection) => {
      return dbConnection.query(
        `
      SELECT I.id, I.codigo,nombre, telefono, 
      (select nombre from departamentos WHERE id = I.departamento) as departamento,
      (select nombre from municipios WHERE id = I.municipio) as municipio, 
      (select nombre from cantones WHERE id = I.canton) as canton, distrito,
      (select nombre from tipo_iglesias WHERE id = I.tipo_iglesia) as tipo_iglesia,
      zona, condicion  FROM iglesias as I join informes_recibidos_gestion as IRG on IRG.iglesia = I.codigo where IRG.gestion = ? LIMIT 50
        `,
        [codigoGestion]
      );
    });
  },
  getDetalleDeInformesDeIglesia: async (data) => {
    const { codigoGestion, codigoIglesia } = data;
    if (!comprobations.areFieldsValid([codigoGestion, codigoIglesia])) {
      return errors.faltanDatosError();
    }
    return await model.multipleTransactionQuery(async (dbConnection) => {
      const testGestion = await dbConnection.query(
        "SELECT codigo from gestiones where codigo=?",
        [codigoGestion]
      );
      const testiglesia = await dbConnection.query(
        "SELECT codigo from iglesias where codigo=?",
        [codigoIglesia]
      );
      console.log(testGestion.length);
      console.log(testiglesia.length);
      if (testGestion.length == 0 || testiglesia.length == 0) {
        return errors.datosNoEncontrados();
      }
      console.log("pasaron");
      return await dbConnection.query(
        "SELECT GI.gestion, MI.nombre as informe, MI.ruta, IRG.informe_ide, IF(IRG.estado is NULL,0,IRG.estado) as estado FROM  gestion_informes as GI  left join maestro_de_informes MI ON GI.informe=MI.id left join informes_recibidos_gestion as IRG on (IRG.gestion = GI.gestion AND IRG.iglesia=?) AND IRG.informe_maestro=MI.id where GI.gestion =? AND GI.informe IN (SELECT informe from iglesias_informes where iglesia = ?)",
        [codigoIglesia, codigoGestion, codigoIglesia]
      );
    });
  },
  getInformesAEnviarDeIglesia: async (data) => {
    const { codigoGestion, codigoIglesia } = data;
    if (!comprobations.areFieldsValid([codigoGestion, codigoIglesia])) {
      return errors.faltanDatosError();
    }
    return await model.multipleTransactionQuery(async (dbConnection) => {
      const testGestion = await dbConnection.query(
        "SELECT codigo from gestiones where codigo=?",
        [codigoGestion]
      );
      const testiglesia = await dbConnection.query(
        "SELECT codigo from iglesias where codigo=?",
        [codigoIglesia]
      );
      if (testGestion.length == 0 || testiglesia.length == 0) {
        return errors.datosNoEncontrados();
      }
      console.log("pasaron");
      return await dbConnection.query(
        "SELECT II.iglesia, GI.gestion, (select nombre from maestro_de_informes where id = II.informe) as informe_nombre, II.informe as informe_id FROM iglesias_informes as II join gestion_informes as GI on II.informe = GI.informe where II.iglesia = ? AND GI.gestion = ?",
        [codigoIglesia, codigoGestion]
      );
    });
  },
  publicarGestion: async (codigoGestion) => {
    if (!comprobations.areFieldsValid([codigoGestion])) {
      return errors.faltanDatosError();
    }
    //llamamos la transaccion
    return await model.multipleTransactionQuery(async (dbConnection) => {
      const result = await dbConnection.query(
        "UPDATE `gestiones` SET `estado`=2 WHERE `codigo` = ?",
        [codigoGestion, codigoGestion]
      );
      return result;
    });
  },
  cerrarGestion: async (codigoGestion) => {
    if (!comprobations.areFieldsValid([codigoGestion])) {
      return errors.faltanDatosError();
    }
    console.log(codigoGestion);
    //llamamos la transaccion
    return await model.multipleTransactionQuery(async (dbConnection) => {
      const result = await dbConnection.query(
        "UPDATE `gestiones` SET `estado`=3 WHERE `codigo` = ?",
        [codigoGestion]
      );
      return result;
    });
  },

  getActivasEnvioDeIglesias: async (data, persona) => {
    const { codigoIglesia } = data;

    if (!comprobations.areFieldsValid([codigoIglesia])) {
      return errors.faltanDatosError();
    }

    return await model.multipleTransactionQuery(async (dbConnection) => {
      const permiso_iglesia = await dbConnection.query(
        "SELECT COUNT(*) AS cantidad FROM administracion_iglesias WHERE persona=? AND iglesia=?",
        [persona, codigoIglesia]
      );
      if (parseInt(permiso_iglesia[0].cantidad) === 0) {
        return errors.RecursoNoAutorizado();
      }
      const gestiones = await dbConnection.query(
        "select id, codigo, descripcion, (select nombre from tipo_gestiones where id = gestiones.tipo_gestion) as tipo_gestion_name, estado, DATE_FORMAT(fecha_publicacion,'%d/%m/%Y') as fecha_publicacion,DATE_FORMAT(fecha_recibir_inicio,'%d/%m/%Y %r') as fecha_recibir_inicio, DATE_FORMAT(fecha_recibir_fin,'%d/%m/%Y %r') as fecha_recibir_fin, DATE_FORMAT(fecha_cr,'%d/%m/%Y %r') as fecha_cr from gestiones where estado = 2 AND tipo_gestion=1 ORDER BY fecha_cr DESC LIMIT 5"
      );
      //  console.log("gestiones", gestiones);
      let data = await Promise.all(
        gestiones.map(async (element) => {
          let validator = await dbConnection.query(
            "SELECT COUNT(*) as cantidad FROM gestion_informes WHERE gestion=? AND informe IN (SELECT informe FROM iglesias_informes WHERE iglesia=?)",
            [element.codigo, codigoIglesia]
          );
          if (parseInt(validator[0].cantidad) > 0) {
            return {
              id: element.id,
              codigo: element.codigo,
              descripcion: element.descripcion,
              tipo_gestion_name: element.tipo_gestion_name,
              estado: element.estado,
              fecha_publicacion: element.fecha_publicacion,
              fecha_recibir_inicio: element.fecha_recibir_inicio,
              fecha_recibir_fin: element.fecha_recibir_fin,
              fecha_cr: element.fecha_cr,
            };
          }
        })
      );
      return await data;
    });
  },

  //Obtiene las iglesias que han enviado un informe en una gesttion
  //data contiene dos parametros idInforme que es el id del informe y codigoGestion de la gestion en la que quiere buscarse
  getIglesiasConInformeEnviadoEnGestion: async (data) => {
    const { codigoGestion, idInforme } = data;
    if (!comprobations.areFieldsValid([codigoGestion, idInforme])) {
      return errors.faltanDatosError();
    }
    return await model.multipleTransactionQuery(async (dbConnection) => {
      return await dbConnection.query(
        `SELECT I.codigo, I.nombre, I.telefono,
        (select nombre from departamentos where I.departamento = id) as departamento,
        (select nombre from municipios where I.municipio = id) as municipio,
        (select nombre from cantones where I.canton = id) as canton,
        I.direccion,
        I.src_google,
        I.distrito,
        (select nombre from tipo_iglesias where I.tipo_iglesia = id) as tipo_iglesia,
        (select nombre from zonas where I.zona = id) as zona
        FROM informes_recibidos_gestion as IRG join iglesias as I on IRG.iglesia = I.codigo  WHERE gestion = ? AND informe_maestro = ? LIMIT 10`,
        [codigoGestion, idInforme]
      );
    });
  },
  //Obtiene las iglesias que han enviado un informe en una gesttion
  //data contiene dos parametros idInforme que es el id del informe y codigoGestion de la gestion en la que quiere buscarse
  getIglesiasConInformeNoEnviadoEnGestion: async (data) => {
    const { codigoGestion, idInforme } = data;
    if (!comprobations.areFieldsValid([codigoGestion, idInforme])) {
      return errors.faltanDatosError();
    }

    return await model.multipleTransactionQuery(async (dbConnection) => {
      //comprobamos que el informe esté asignado a la gestion
      const informeTest = await dbConnection.query(
        "SELECT id FROM `gestion_informes` WHERE informe = ? AND gestion = ?",
        [idInforme, codigoGestion]
      );
      if (informeTest.length == 0) {
        return errors.datosNoEncontrados(
          "El informe no está asignado a la gestión"
        );
      }
      //Obtenemos el listado de iglesias que deben enviar el informe especificado
      //Solo se incluyen aquellas iglesias que tienen asignado el informe especificado
      const listadoDeIglesias = await dbConnection.query(
        "SELECT iglesia FROM `iglesias_informes` WHERE informe = ?",
        [idInforme]
      );

      if (listadoDeIglesias.length == 0) {
        return errors.datosNoEncontrados(
          "El informe no está asignado a ninguna iglesia"
        ); // Ninguna iglesia tiene especificado el informe
      }

      return await dbConnection.query(
        `SELECT I.codigo, I.nombre, I.telefono,
        (select nombre from departamentos where I.departamento = id) as departamento,
        (select nombre from municipios where I.municipio = id) as municipio,
        (select nombre from cantones where I.canton = id) as canton,
        I.direccion,
        I.src_google,
        I.distrito,
        (select nombre from tipo_iglesias where I.tipo_iglesia = id) as tipo_iglesia,
        (select nombre from zonas where I.zona = id) as zona FROM iglesias_informes as II join iglesias as I on I.codigo = II.iglesia  where informe = ? AND  II.iglesia not IN (select iglesia from informes_recibidos_gestion where gestion = ? AND informe_maestro = ? ) LIMIT 10`,
        [idInforme, codigoGestion, idInforme]
      );
    });
  },
  template: async (data) => {},
};
