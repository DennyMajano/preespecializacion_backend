const modelPastores = require("../../models/Pastores/Pastores.model");
const isUndefinedOrNull = require("validate.io-undefined-or-null");
module.exports = {
  create: async (req, res) => {
    try {
      //Validacion de datos de entrada
      const camposEntrada = [
        req.body.personaCode,
        req.body.licenciaMinisterial,
        req.body.nivelPastoral,
        req.body.nivelAcademico,
        req.body.fechaInicioPastoral,
      ];

      validateFieldsOr400(camposEntrada, res);

      //Consulta a modelo
      const result = await modelPastores.create(req.body);
      console.log(result);
      //Validar resultado
      validateResult201ForInsertOr500(result, res, (result) => {
        return { id: result.insertId, code: result.code };
      });
    } catch (error) {
      sendErrorOn500(error, res);
    }
  },

  update: async (req, res) => {
    try {
      const camposEntrada = [
        req.body.codigoPastor,
        req.body.licenciaMinisterial,
        req.body.nivelPastoral,
        req.body.nivelAcademico,
        req.body.fechaInicioPastoral,
        req.body.fechaRetiro,
        req.body.fallecido,
        req.body.status,
        req.body.biografia,
        req.body.memoria_fallecimiento,
      ];
      validateFieldsOr400(camposEntrada,res);

      const result = await modelPastores.update(req.body);
      validateResult200ForUpdateOr500(result, res);
    } catch (error) {
      sendErrorOn500(error, res);
    }
  },
  getById: async (req, res) =>{
   try {
    validateFieldsOr400([req.params.code]);

    const result = await modelPastores.getById(req.params.code);

    validateResult200ForSelectOneOr500(result, res);
   } catch (error) {
     sendErrorOn500(error,res)
   }
  },
  getSelect: async (req, res)=>{
    try {
      const result = await modelPastores.getSelect(req.params.filter);

      validateResult200ForSelectOr500(result,res);

    } catch (error) {
      sendErrorOn500(error,res)
    }
  },
  getAll: async (req, res)=>{
    try {
      const result = await modelPastores.getAll(req.params.filter);

      validateResult200ForSelectOr500(result,res);

    } catch (error) {
      sendErrorOn500(error,res)
    }
  },
  getFilterModal: async (req, res)=>{
    try {
      const result = await modelPastores.getFilterModal(req.params.filter);

      validateResult200ForSelectOr500(result,res);

    } catch (error) {
      sendErrorOn500(error,res)
    }
  },
  updateStatus: async (req, res) => {
    try {
      const camposEntrada = [
        req.body.status,
        req.body.code
      ];
      validateFieldsOr400(camposEntrada,res);

      const result = await modelPastores.updateStatus(req.body);
      validateResult200ForUpdateOr500(result, res);
    } catch (error) {
      sendErrorOn500(error, res);
    }
  },
  enableDisable: async (req, res) => {
    try {
      const camposEntrada = [
        req.body.status,
        req.body.code
      ];
      validateFieldsOr400(camposEntrada,res);

      const result = await modelPastores.enableDisable(req.body);
      validateResult200ForUpdateOr500(result, res);
    } catch (error) {
      sendErrorOn500(error, res);
    }
  },
};

//Funciones comunes para todos los métodos de los controladores
function validateResult201ForInsertOr500(
  result,
  res,
  onSucces = (result) => {
    return { id: result.insertId };
  }
) {
  //Verificacion de error devuelto
  if (result.errno || result instanceof Error) throw result;
  //Si los datos de entrada son validos y no se devolvio error entonces
  if (result.affectedRows > 0) {
    res.status(201).json({ success: true, data: onSucces(result) });
  } else {
    throw new Error("Los datos no pudieron ser registrados");
  }
}
function validateResult200ForUpdateOr500(
  result,
  res,
  onSucces = (result) => {
    return { message: "Datos actualizados" };
  }
) {
  //Verificacion de error devuelto
  if (result.errno || result instanceof Error) throw result;
  //Si los datos de entrada son validos y no se devolvio error entonces
  console.log(result);
  if (result.affectedRows > 0) {
    res.status(200).json({ success: true, data: onSucces(result) });
  } else {
    throw new Error("Los datos no pudieron ser registrados, probablemente el registro especificado no existe");
  }
}
function validateResult200ForSelectOneOr500(
  result,
  res,
  onSucces = (result) => {
    return result[0];
  }
) {
  //Verificacion de error devuelto
  if (result.errno || result instanceof Error) throw result;
  //Si los datos de entrada son validos y no se devolvio error entonces
  console.log(result);
  res.status(200).json({ success: true, data: onSucces(result) });
}
function validateResult200ForSelectOr500(
  result,
  res,
  onSucces = (result) => {
    return result;
  }
) {
  //Verificacion de error devuelto
  if (result.errno || result instanceof Error) throw result;
  //Si los datos de entrada son validos y no se devolvio error entonces
  console.log(result);
  //res.status(200).json({ success: true, data: onSucces(result) });
  res.status(200).json(onSucces(result) );
}
function sendErrorOn500(error, res) {
  console.log(error);
  res.status(500).json({ success: false, error: "Error de servidor" });
}
function validateFieldsOr400(fields = [], res) {
  if (!areFieldsValid(fields)) {
    res
      .status(400)
      .json({ success: false, error: "Faltan datos en la petición" });
  }
}
function areFieldsValid(fields = []) {
  return !fields.some((field) => isUndefinedOrNull(field));
}
