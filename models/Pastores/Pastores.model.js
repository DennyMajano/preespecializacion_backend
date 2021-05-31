const GeneratorCode = require("../../helpers/GeneratorCode");
const database = require("../../config/database.async");
const db = require("../../config/conexion");
const isUndefinedOrNull = require("validate.io-undefined-or-null/lib");
module.exports = {
  create: async (data) => {
    const {
      personaCode,
      licenciaMinisterial,
      nivelPastoral,
      nivelAcademico,
      fechaInicioPastoral,
      fechaRetiro,
      status,
      fallecido,
      memoriaFallecimiento,
      biografia
    } = data;

    const newPastorCode = GeneratorCode("PT");

    const result = await simpleTransactionQuery(
      "INSERT INTO `pastores` (`codigo`, `persona`, `licencia_ministerial`, `nivel_pastoral`, `nivel_academico`, `fecha_inicio_pastoral`, `fecha_retiro`, `status`, `fallecido`,`memoria_fallecimiento`,`biografia`) VALUES (?,?,?,?,?,?,?,?,?,?,?);",
      [
        newPastorCode,
        personaCode,
        licenciaMinisterial,
        nivelPastoral,
        nivelAcademico,
        fechaInicioPastoral,
        fechaRetiro,
        status,
        fallecido,
        memoriaFallecimiento,
        biografia
      ]
    );
    result.code = newPastorCode;
    return result;
  },
  update: async (data) => {
    console.log(data);
    const {
      codigoPastor,
      licenciaMinisterial,
      nivelPastoral,
      nivelAcademico,
      fechaInicioPastoral,
      fechaRetiro,
      fallecido,
      status,
      biografia,
      memoriaFallecimiento,
    } = data;
    return await simpleTransactionQuery(
      "UPDATE `pastores` SET `licencia_ministerial`=?,`nivel_pastoral`=?,`nivel_academico`=?,`fecha_inicio_pastoral`=?,`fecha_retiro`=?,`fallecido`=?,`status`=?,`biografia`=?,`memoria_fallecimiento`=? WHERE `codigo`=?",
      [
        licenciaMinisterial,
        nivelPastoral,
        nivelAcademico,
        fechaInicioPastoral,
        fechaRetiro,
        fallecido,
        status,
        biografia,
        memoriaFallecimiento,
        codigoPastor,
      ]
    );
  },
  getById: async (id) => {
    const estados = [
      { label: "De baja", value: 0 },
      { label: "Activo", value: 1 },
      { label: "Retirado", value: 2 },
      { label: "Con permiso", value: 3 },
    ];
    return await simpleTransactionQuery(
      `select id, codigo, persona, licencia_ministerial,
      nivel_pastoral as nivel_pastoral_code,
      (select nombre from nivel_pastor WHERE id= pastores.nivel_pastoral ) as nivel_pastoral_name,
      nivel_academico as nivel_academico_code, 
      (select nombre from niveles_academicos_pastorales WHERE id= pastores.nivel_academico ) as nivel_academico_name,
      DATE_FORMAT(fecha_inicio_pastoral, '%Y-%m-%d') AS fecha_inicio_pastoral, DATE_FORMAT(fecha_retiro, '%Y-%m-%d') AS fecha_retiro, fallecido, status, biografia, memoria_fallecimiento from pastores where id = ? or codigo = ? or licencia_ministerial = ?`,
      [id, id, id],
      async (queryResult) => {
        if (queryResult.length > 0) {
          return {
            id: queryResult[0].id,
            codigo: queryResult[0].codigo,
            persona: queryResult[0].persona,
            licencia_ministerial: queryResult[0].licencia_ministerial,
            nivel_pastoral: {
              label: queryResult[0].nivel_pastoral_name,
              value: queryResult[0].nivel_pastoral_code,
            },
            nivel_academico: {
              label: queryResult[0].nivel_academico_name,
              value: queryResult[0].nivel_academico_code,
            },
            fecha_inicio_pastoral: queryResult[0].fecha_inicio_pastoral,
            fecha_retiro: queryResult[0].fecha_retiro,
            fallecido: queryResult[0].fallecido,
            status: estados.find(
              (estado) => estado.value == queryResult[0].status
            ),
            biografia: queryResult[0].biografia,
            memoria_fallecimiento: queryResult[0].memoria_fallecimiento,
          };
        }
      }
    );
  },
  getSelect: async (filter) => {
    if (isUndefinedOrNull(filter)) {
      return await simpleTransactionQuery(
        "SELECT PAS.id as id, PAS.codigo as codigo, concat(PER.nombres,' ', PER.apellidos) as nombre from pastores as PAS JOIN personas as PER on PAS.persona = PER.codigo WHERE PAS.condicion=1 ORDER BY PER.nombres LIMIT 50"
      );
    } else {
      filter = filter.split(" ");
      let query =
        "SELECT PAS.id as id, PAS.codigo as codigo, concat(PER.nombres,' ', PER.apellidos) as nombre from pastores as PAS JOIN personas as PER on PAS.persona = PER.codigo WHERE PAS.condicion=1 ";

      for (word of filter) {
        query += `AND (PER.numero_documento like '%${word}%' OR PER.nombres like '%${word}%' OR PER.apellidos like '%${word}%' OR PAS.licencia_ministerial like '%${word}%' OR PAS.codigo like '%${word}%')`;
      }
      query += " ORDER BY PER.nombres DESC LIMIT 50";
      console.log(query);
      return await simpleTransactionQuery(query);
    }
  },
  getFilterModal: async (filter) => {
    if (isUndefinedOrNull(filter)) {
      return await simpleTransactionQuery(
        "SELECT PAS.condicion, PAS.status PAS.id as id, PAS.codigo, PER.nombres, PER.apellidos, (select nombre from niveles_academicos_pastorales where id = PAS.nivel_academico) as nivel_academico, (select nombre from nivel_pastor WHERE id = PAS.nivel_pastoral) as nivel_pastoral from pastores as PAS JOIN personas as PER on PAS.persona = PER.codigo WHERE PAS.condicion = 1 ORDER BY PER.nombres LIMIT 50"
      );
    } else {
      filter = filter.split(" ");
      let query =
        "SELECT PAS.condicion, PAS.id as id, PAS.codigo, PER.nombres, PER.apellidos, (select nombre from niveles_academicos_pastorales where id = PAS.nivel_academico) as nivel_academico, (select nombre from nivel_pastor WHERE id = PAS.nivel_pastoral) as nivel_pastoral from pastores as PAS JOIN personas as PER on PAS.persona = PER.codigo WHERE PAS.condicion = 1 ";

      for (word of filter) {
        query += `AND (PER.numero_documento like '%${word}%' OR PER.nombres like '%${word}%' OR PER.apellidos like '%${word}%' OR PAS.licencia_ministerial like '%${word}%' OR PAS.codigo like '%${word}%')`;
      }
      query += " ORDER BY PER.nombres DESC LIMIT 50";
      console.log(query);
      return await simpleTransactionQuery(query);
    }
  },
  getAll: async (filter) => {
    if (isUndefinedOrNull(filter)) {
      return await simpleTransactionQuery(
        "SELECT PAS.condicion, PAS.status, PAS.id as id, PAS.codigo, PER.nombres, PER.apellidos, (select nombre from niveles_academicos_pastorales where id = PAS.nivel_academico) as nivel_academico, (select nombre from nivel_pastor WHERE id = PAS.nivel_pastoral) as nivel_pastoral from pastores as PAS JOIN personas as PER on PAS.persona = PER.codigo ORDER BY PER.nombres LIMIT 50"
      );
    } else {
      filter = filter.split(" ");
      let query =
        "SELECT PAS.condicion, PAS.status, PAS.id as id, PAS.codigo, PER.nombres, PER.apellidos, (select nombre from niveles_academicos_pastorales where id = PAS.nivel_academico) as nivel_academico, (select nombre from nivel_pastor WHERE id = PAS.nivel_pastoral) as nivel_pastoral from pastores as PAS JOIN personas as PER on PAS.persona = PER.codigo WHERE 1 ";

      for (word of filter) {
        query += `AND (PER.numero_documento like '%${word}%' OR PER.nombres like '%${word}%' OR PER.apellidos like '%${word}%' OR PAS.licencia_ministerial like '%${word}%' OR PAS.codigo like '%${word}%')`;
      }
      query += " ORDER BY PER.nombres DESC LIMIT 50";
      console.log(query);
      return await simpleTransactionQuery(query);
    }
  },
  updateStatus: async (data) => {
    const { status, code } = data;
    return await simpleTransactionQuery(
      "UPDATE `pastores` SET `status`=? WHERE `codigo`=?",
      [status, code]
    );
  },
  enableDisable: async (data) => {
    const { status, code } = data;
    return await simpleTransactionQuery(
      "UPDATE `pastores` SET `condicion`=? WHERE `codigo`=?",
      [status, code]
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
