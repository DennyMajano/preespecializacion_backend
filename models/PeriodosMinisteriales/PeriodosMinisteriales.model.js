const GeneratorCode = require("../../helpers/GeneratorCode");
const database = require("../../config/database.async");
const db = require("../../config/conexion");
const isUndefinedOrNull = require("validate.io-undefined-or-null/lib");

module.exports = {
  create: async (data) => {
    const { descripcion, anio } = data;
    if (!areFieldsValid([descripcion, anio])) {
      return {
        errno: 1,
        error: new Error("Faltan datos"),
      };
    }

    const periodoCodigo = GeneratorCode("PM");
    let result = await simpleTransactionQuery(
      "INSERT INTO `periodo_ministerial`(`codigo`, `descripcion`, `anio`) VALUES (?,?,?) ",
      [periodoCodigo, descripcion, anio]
    );
    result.code = periodoCodigo;
    return result;
  },
  update: async (data) => {
    const { descripcion, anio, codigo } = data;
    if (!areFieldsValid([descripcion, anio, codigo])) {
      return {
        errno: 1,
        error: new Error("Faltan datos"),
      };
    }

    return await simpleTransactionQuery(
      "update periodo_ministerial set descripcion=?, anio =? where codigo=? OR id =? ",
      [descripcion, anio, codigo, codigo]
    );
  },

  getAllPeriodosMinisteriales: async (filter) => {
    if (isUndefinedOrNull(filter)) {
      return await simpleTransactionQuery(
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
      return await simpleTransactionQuery(query);
    }
  },
  getAllPeriodosMinisterialesByState: async (estado) => {
    if (!areFieldsValid([estado])) {
      return {
        errno: 1,
        error: new Error("Faltan datos"),
      };
    }

    return simpleTransactionQuery(
      "select * from periodo_ministerial where estado = ? limit 50",
      [estado]
    );
  },
  getPeriodoMinisterialByCodigoOrId: async (codigo) => {
    if (!areFieldsValid([codigo])) {
      return {
        errno: 1,
        error: new Error("Faltan datos"),
      };
    }

    return simpleTransactionQuery(
      "select * from periodo_ministerial where id = ? OR codigo = ? limit 50",
      [codigo, codigo]
    );
  },
  isPeriodoMinisterialValidToFinalizar: async (codigo) => {
    if (!areFieldsValid([codigo])) {
      return {
        errno: 1,
        error: new Error("Faltan datos"),
      };
    }
    
    const gestionesNoFinalizadas = await simpleTransactionQuery(
        "SELECT count(*) as cantidad FROM gestiones WHERE periodo = ? AND (estado = 1 OR estado = 3)",
        [codigo]
      );

      return {puedeFinalizar: gestionesNoFinalizadas[0].cantidad < 1};
  },
  setFinalizadoPeriodoMinisterial: async (data) => {
    const { codigo } = data;
    if (!areFieldsValid([codigo])) {
      return {
        errno: 1,
        error: new Error("Faltan datos"),
      };
    }

    const gestionesNoFinalizadas = await simpleTransactionQuery(
      "SELECT count(*) as cantidad FROM gestiones WHERE periodo = ? AND (estado = 1 OR estado = 3)",
      [codigo]
    );
    console.log(gestionesNoFinalizadas);
    //Si las gestiones no finalizadas son menor que uno es decir cero se actualiza de lo contrario no.
    if (gestionesNoFinalizadas[0].cantidad < 1) {
      return await simpleTransactionQuery(
        "UPDATE `periodo_ministerial`set estado=3 WHERE codigo=?",
        [codigo]
      );
    } else {
      return {
        errno: 2,
        error: new Error(
          "No se puede finalizar por gestiones aun no finalizadas"
        ),
      };
    }
  },
  setVigentePeriodoMinisterial: async (data) => {
    const { codigo } = data;
    if (!areFieldsValid([codigo])) {
      return {
        errno: 1,
        error: new Error("Faltan datos"),
      };
    }

    return await simpleTransactionQuery(
      "update periodo_ministerial set estado=2 where codigo=? and estado = 1",
      [codigo]
    );
  },
};

//Base
async function simpleTransactionQuery(
  sqlQuery,
  params,
  callback = async (queryResult) => {
    return queryResult;
  }
) {
  try {
    let result;
    const transactionResult = await database.Transaction(db, async () => {
      //cosas
      const queryResult = await db.query(sqlQuery, params);

      result = await callback(queryResult);
    });

    if (transactionResult.errno || transactionResult instanceof Error) {
      throw transactionResult;
    }
    return result;
  } catch (error) {
    return error;
  }
}
function areFieldsValid(fields = []) {
  return !fields.some((field) => isUndefinedOrNull(field));
}
