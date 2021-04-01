const model = require("../Model");
const comprobations = require("../../helpers/DataComprobations");
const errors = require("../../helpers/OurErrors");
const GeneratorCode = require("../../helpers/GeneratorCode");
const Token = require("../../services/security/Token");

module.exports = {
  create: async (data) => {
    const { usuarioToken, descripcion, tipo, fechaRecibirFin, periodo } = data;
    console.log([
      usuarioToken,
      descripcion,
      tipo,
      /* fechaRecibirInicio,*/ fechaRecibirFin,
      periodo,
    ]);
    //Comprobamos que los campos sean validos
    if (
      !comprobations.areFieldsValid([
        usuarioToken,
        descripcion,
        tipo,
        /* fechaRecibirInicio,*/ fechaRecibirFin,
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
        // "INSERT INTO `gestiones`(`codigo`, `descripcion`, `tipo_gestion`,`usuario_cr`,`fecha_recibir_inicio`, `fecha_recibir_fin`, `periodo`) VALUES (?,?,?,?,?,?,?)",
        "INSERT INTO `gestiones`(`codigo`, `descripcion`, `tipo_gestion`,`usuario_cr`,`fecha_recibir_fin`, `periodo`) VALUES (?,?,?,?,?,?)",
        [codigoGestion, descripcion, tipo, usuario, fechaRecibirFin, periodo]
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
    } = data;
    if (
      !comprobations.areFieldsValid([
        usuarioToken,
        descripcion,
        tipo,
        fechaRecibirFin,
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
        "UPDATE `gestiones` SET `descripcion`=?,`tipo_gestion`=?,`usuario_uac`=?,`fecha_recibir_fin`=? WHERE `codigo` = ?",
        [descripcion, tipo, usuario, fechaRecibirFin, codigoGestion]
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
        "select id, codigo, tipo_gestion as tipo_gestion_id, (select nombre from tipo_gestiones where id = gestiones.tipo_gestion) as tipo_gestion_name, estado, fecha_publicacion, fecha_recibir_inicio, fecha_recibir_fin from gestiones WHERE codigo = ? or id =?",
        [codigoGestion, codigoGestion]
      );
    });
  },
  getGestionesActivas: async () => {
    return await model.multipleTransactionQuery(async (dbConnection) => {
      return await dbConnection.query(
        "select id, codigo, (select nombre from tipo_gestiones where id = gestiones.tipo_gestion) as tipo_gestion_name, estado, fecha_publicacion, fecha_recibir_inicio, fecha_recibir_fin from gestiones where estado = 2"
      );
    });
  },
  getInformesAsignados: async (codigoGestion) => {
    if (!comprobations.areFieldsValid([codigoGestion])) {
      return errors.faltanDatosError();
    }
    return await model.multipleTransactionQuery(async (dbConnection) => {
      return await dbConnection.query(
        "select informe as informe_id, (select nombre from maestro_de_informes where id = informe) as informe_nombre, mes as mes_id, (select nombre from meses where id = MGI.mes) as mes_nombre, gestion_informe from gestion_informes as GI join meses_gestion_informe as MGI on GI.id = MGI.gestion_informe where GI.gestion = ?",
        [codigoGestion]
      );
    });
  },
  asignarInforme: async (data) => {
    const { codigoGestion, informeId, mesId } = data;
    if (!comprobations.areFieldsValid([codigoGestion, informeId, mesId])) {
      return errors.faltanDatosError();
    }
    return await model.multipleTransactionQuery(async (dbConnection) => {
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
  template: async (data) => {},
};
