const GeneratorCode = require("../../helpers/GeneratorCode");
const model = require("../Model");
const comprobations = require("../../helpers/DataComprobations");
const errors = require("../../helpers/OurErrors");

module.exports = {
  create: async (data) => {
    const { descripcion, anio } = data;
    if (!comprobations.areFieldsValid([descripcion, anio])) {
      return errors.faltanDatosError();
    }

    const periodoCodigo = GeneratorCode("PM");
    let result = await model.simpleTransactionQuery(
      "INSERT INTO `periodo_ministerial`(`codigo`, `descripcion`, `anio`) VALUES (?,?,?) ",
      [periodoCodigo, descripcion, anio]
    );
    result.code = periodoCodigo;
    return result;
  },
  update: async (data) => {
    const { descripcion, anio, codigo } = data;
    if (!comprobations.areFieldsValid([descripcion, anio, codigo])) {
      return errors.faltanDatosError();
    }

    return await model.simpleTransactionQuery(
      "update periodo_ministerial set descripcion=?, anio =? where codigo=? OR id =? ",
      [descripcion, anio, codigo, codigo]
    );
  },
  getAllPeriodosMinisteriales: async (filter) => {
    if (isUndefinedOrNull(filter)) {
      return await model.simpleTransactionQuery(
        "select * from periodo_ministerial limit 50"
      );
    } else {
      filter = filter.split(" ");
      let query = "select * from periodo_ministerial as PM where 1 ";

      for (word of filter) {
        query += `AND (PM.descripcion like '%${word}%')`;
      }
      query += " ORDER BY PM.codigo DESC LIMIT 50";
      console.log(query);
      return await model.simpleTransactionQuery(query);
    }
  },
  getAllPeriodosMinisterialesByState: async (estado) => {
    if (!comprobations.areFieldsValid([estado])) {
      return errors.faltanDatosError();
    }

    return model.simpleTransactionQuery(
      "select * from periodo_ministerial where estado = ? limit 50",
      [estado]
    );
  },
  getPeriodoMinisterialByCodigoOrId: async (codigo) => {
    if (!comprobations.areFieldsValid([codigo])) {
      return errors.faltanDatosError();
    }
    return model.simpleTransactionQuery(
      "select * from periodo_ministerial where estado = 1 AND(id = ? OR codigo = ?) limit 50",
      [codigo, codigo]
    );
  },
  isPeriodoMinisterialValidToFinalizar: async (codigo) => {
    if (!comprobations.areFieldsValid([codigo])) {
      return errors.faltanDatosError();
    }

    const gestionesNoFinalizadas = await model.simpleTransactionQuery(
      "SELECT count(*) as cantidad FROM gestiones WHERE periodo = ? AND (estado = 1 OR estado = 3)",
      [codigo]
    );

    return { puedeFinalizar: gestionesNoFinalizadas[0].cantidad < 1 };
  },
  setVigentePeriodoMinisterial: async (data) => {
    const { codigo } = data;
    if (!comprobations.areFieldsValid([codigo])) {
      return errors.faltanDatosError();
    }

    return await model.multipleTransactionQuery(async (dbConnection) => {
      const resultVigentes = await  dbConnection.query(
        "SELECT * FROM `periodo_ministerial` WHERE`estado` = 2"
      );

      console.log(resultVigentes);
      if (resultVigentes.length > 0) {
        return errors.requerimientosNoPasados();
      } else {
        return await dbConnection.query(
          "update periodo_ministerial set estado=2 where codigo=? and estado = 1",
          [codigo]
        );
      }
    });
  },
  deletePeriodo: async (id) => {
    if (!comprobations.areFieldsValid([id])) {
      return errors.faltanDatosError();
    }

    return await model.simpleTransactionQuery(
      "DELETE FROM periodo_ministerial WHERE id = ?",
      [id]
    );
  },
  setFinalizadoPeriodoMinisterial: async (data) => {
    const { codigo } = data;
    if (!comprobations.areFieldsValid([codigo])) {
      return errors.faltanDatosError();
    }

    return await model.multipleTransactionQuery(async (dbConnection) => {
      const gestionesNoFinalizadas = await dbConnection.query(
        "SELECT count(*) as cantidad FROM gestiones WHERE periodo = ? AND (estado = 1 OR estado = 3)",
        [codigo]
      );
      if (gestionesNoFinalizadas[0].cantidad < 1) {
        return dbConnection.query(
          "UPDATE `periodo_ministerial`set estado=3 WHERE codigo=?",
          [codigo]
        );
      } else {
        return errors.requerimientosNoPasados(
          "No se pueden finalizar periodos ministeriales con gestiones no finalizadas"
        );
      }
    });
  },
};
