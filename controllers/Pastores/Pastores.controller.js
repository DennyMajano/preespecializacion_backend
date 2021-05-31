const modelPastores = require("../../models/Pastores/Pastores.model");
const modelPersonas = require("../../models/Personas/Personas.model");
const isUndefinedOrNull = require("validate.io-undefined-or-null");
module.exports = () => {
  let pastores = {};
  pastores.create = async (req, res) => {
    console.log(req.body);
    try {
      //Validacion de datos de entrada
      const camposEntrada = [
        req.body.licenciaMinisterial,
        req.body.nivelPastoral,
        req.body.nivelAcademico,
        req.body.fechaInicioPastoral,
        req.body.status,
        req.body.fallecido,
      ];
      if (!areFieldsValid(camposEntrada)) {
        return send400BadData(res);
      }
      if (!req.body.personaCode) {
        const personaResult = await modelPersonas.create(req.body);
        if (personaResult.errno) {
          throw personaResult;
        } else {
          console.log("INSERT PERSON FOR PASTOR");
          console.log(personaResult);
          console.log(req.body);
          req.body.personaCode = personaResult.codigo;
        }
      } else {
        modelPersonas.update(req.body);
      }
      console.log(req.body);

      //Consulta a modelo
      const result = await modelPastores.create(req.body);
      console.log(
        "#######################################################################################"
      );
      console.log(result);
      //Validar resultado
      validateResult201ForInsertOr500(result, res, (result) => {
        return { id: result.insertId, code: result.code };
      });
    } catch (error) {
      sendErrorOn500(error, res);
    }
  };
  pastores.update = async (req, res) => {
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
        req.body.memoriaFallecimiento,
      ];
      console.log(
        "PASTOR___________________________________________________________________"
      );
      console.log(camposEntrada);
      if (!areFieldsValid(camposEntrada)) {
        return send400BadData(res);
      }

      const personaResult = await modelPersonas.update(req.body);
      console.log("HAY EROR");
      console.log(personaResult.affectedRows > 0);
      if (personaResult.affectedRows > 0) {
        const result = await modelPastores.update(req.body);
        console.log(
          "RESULT___________________________________________________________________"
        );
        console.log(result);
        validateResult200ForUpdateOr500(result, res);
      } else {
        throw personaResult;
      }
    } catch (error) {
      sendErrorOn500(error, res);
    }
  };
  pastores.getById = async (req, res) => {
    try {
      if (!areFieldsValid([req.params.code])) {
        return send400BadData(res);
      }
      const result = await modelPastores.getById(req.params.code);
      console.log(result);
      validateResult200ForSelectOneOr500(result, res);
    } catch (error) {
      sendErrorOn500(error, res);
    }
  };
  pastores.getSelect = async (req, res) => {
    try {
      const result = await modelPastores.getSelect(req.params.filter);

      validateResult200ForSelectOr500(result, res);
    } catch (error) {
      sendErrorOn500(error, res);
    }
  };
  pastores.getAll = async (req, res) => {
    try {
      const result = await modelPastores.getAll(req.params.filter);

      validateResult200ForSelectOr500(result, res);
    } catch (error) {
      sendErrorOn500(error, res);
    }
  };
  pastores.getFilterModal = async (req, res) => {
    try {
      const result = await modelPastores.getFilterModal(req.params.filter);

      validateResult200ForSelectOr500(result, res);
    } catch (error) {
      sendErrorOn500(error, res);
    }
  };
  pastores.updateStatus = async (req, res) => {
    try {
      const camposEntrada = [req.body.status, req.body.code];
      if (!areFieldsValid(camposEntrada)) {
        return send400BadData(res);
      }

      const result = await modelPastores.updateStatus(req.body);
      validateResult200ForUpdateOr500(result, res);
    } catch (error) {
      sendErrorOn500(error, res);
    }
  };
  pastores.enableDisable = async (req, res) => {
    try {
      const camposEntrada = [req.body.status, req.body.code];
      if (!areFieldsValid(camposEntrada)) {
        return send400BadData(res);
      }

      const result = await modelPastores.enableDisable(req.body);
      validateResult200ForUpdateOr500(result, res);
    } catch (error) {
      sendErrorOn500(error, res);
    }
  };

  return pastores;
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
    throw new Error(
      "Los datos no pudieron ser registrados, probablemente el registro especificado no existe"
    );
  }
}
function validateResult200ForSelectOneOr500(
  result,
  res,
  onSucces = (result) => {
    if (Array.isArray(result)) {
      return result[0];
    } else {
      return result;
    }
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
  res.status(200).json(onSucces(result));
}
function sendErrorOn500(error, res) {
  console.log(error);
  res.status(500).json({ success: false, error: "Error de servidor" });
}
function send400BadData(res) {
  return res
    .status(400)
    .json({ success: false, error: "Faltan datos en la petición" });
}
function areFieldsValid(fields = []) {
  return !fields.some((field) => isUndefinedOrNull(field));
}
