const modelPeriodos = require("../../models/PeriodosMinisteriales/PeriodosMinisteriales.model");
const modelPersonas = require("../../models/Personas/Personas.model");
const isUndefinedOrNull = require("validate.io-undefined-or-null");
module.exports = () => {
  let periodosministeriales = {};
  periodosministeriales.create = async (req, res) => {
    console.log(req.body);
    try {
      console.log(req.body);
      const result = await modelPeriodos.create(req.body);
      console.log(result);
      //Validar resultado
      validateResultForInsert201(result, res, (result) => {
        return { id: result.insertId, code: result.code };
      });
    } catch (error) {
      sendError(error, res);
    }
  };
  periodosministeriales.update = async (req, res) => {
    try {
      console.log(req.body);
      const result = await modelPeriodos.update(req.body);
      console.log(result);
      validateResultForUpdate200(result, res);
    } catch (error) {
      sendError(error, res);
    }
  };
  periodosministeriales.getAll = async (req, res) => {
    try {
      console.log(req.params);
      const result = await modelPeriodos.getAllPeriodosMinisteriales(
        req.params.filter
      );
      console.log(result);
      validateResultForSelect200(result, res);
    } catch (error) {
      sendError(error, res);
    }
  };
  periodosministeriales.getByState = async (req, res) => {
    try {
      console.log(req.params);
      const result = await modelPeriodos.getAllPeriodosMinisterialesByState(
        req.params.estado
      );
      console.log(result);
      validateResultForSelect200(result, res);
    } catch (error) {
      sendError(error, res);
    }
  };
  periodosministeriales.getByCodigoOrId = async (req, res) => {
    console.log(req.params);
    try {
      const result = await modelPeriodos.getPeriodoMinisterialByCodigoOrId(
        req.params.codigo
      );
      console.log(result);
      validateResultForSelectOne200(result, res);
    } catch (error) {
      sendError(error, res);
    }
  };
  periodosministeriales.isPeriodoMinisterialValidForFinalizar = async (req, res) => {
    console.log(req.params);
    try {
      const result = await modelPeriodos.isPeriodoMinisterialValidToFinalizar(
        req.params.codigo
      );
      console.log(result);
      validateResultForSelectOne200(result, res);
    } catch (error) {
      sendError(error, res);
    }
  };
  periodosministeriales.finalizarPeriodo = async (req, res) => {
    try {
      console.log(req.body);
      const result = await modelPeriodos.setFinalizadoPeriodoMinisterial(
        req.body
      );
      console.log(result);
      validateResultForUpdate200(result, res);
    } catch (error) {
      sendError(error, res);
    }
  };
  periodosministeriales.ponerVigentePeriodo = async (req, res) => {
    try {
      console.log(req.body);
      const result = await modelPeriodos.setVigentePeriodoMinisterial(
        req.body
      );
      console.log(result);
      validateResultForUpdate200(result, res);
    } catch (error) {
      sendError(error, res);
    }
  };
  return periodosministeriales;
};

//Funciones comunes para todos los métodos de los controladores
function validateResultForInsert201(
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
function validateResultForUpdate200(
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
  if (result.affectedRows >= 0) {
    res.status(200).json({ success: true, data: onSucces(result) });
  } else {
    throw new Error(
      "Los datos no pudieron ser registrados, probablemente el registro especificado no existe"
    );
  }
}
function validateResultForSelectOne200(
  result,
  res,
  onSucces = (result) => {
    if (Array.isArray(result)) {
      return result[0] ? result[0] : null;
    } else {
      return result;
    }
  }
) {
  //Verificacion de error devuelto
  if (result.errno || result instanceof Error) throw result;
  //Si los datos de entrada son validos y no se devolvio error entonces
  console.log(result);
  res.status(200).json(onSucces(result) );
}
function validateResultForSelect200(
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
  res.status(200).json(onSucces(result));
}
function sendError(error, res) {
  if (error.errno) {
    if (error.errno == 1) {
      return res.status(400).json({ success: false, error: "Faltan datos" });
    } else if (error.errno == 2) {
      return res.status(403).json({ success: false, error: "No se puede actualizar el registro debido a que no se cumplen las condiciones necesarias" });
    }
    else{
        return res.status(500).json({ success: false, error: "Error de servidor" });
    }
  } else {
    return res.status(500).json({ success: false, error: "Error de servidor" });
  }
}
