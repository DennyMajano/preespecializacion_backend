const OurErrors = require("../helpers/OurErrors");

module.exports = {
  //Funciones comunes para todos los métodos de los controladores
  validateResultForInsert: (
    result,
    res,
    onSucces = (result) => {
      return { id: result.insertId };
    }
  ) => {
    //Verificacion de error devuelto
    resultErrorComprobation(result);
    //Si los datos de entrada son validos y no se devolvio error entonces
    if (result.affectedRows > 0) {
      res.status(201).json(onSucces(result));
    } else {
      throw new Error("Los datos no pudieron ser registrados");
    }
  },
  validateResultForUpdate: (
    result,
    res,
    onSucces = (result) => {
      return { message: "Datos actualizados" };
    }
  ) => {
    //Verificacion de error devuelto
    resultErrorComprobation(result);
    //Si los datos de entrada son validos y no se devolvio error entonces
    console.log(result);
    if (result.affectedRows >= 0) {
      res.status(200).json(onSucces(result));
    } else {
      throw new Error(
        "Los datos no pudieron ser registrados, probablemente el registro especificado no existe"
      );
    }
  },
  validateResultForSelectOne: (
    result,
    res,
    onSucces = (result) => {
      if (Array.isArray(result)) {
        return result[0] ? result[0] : null;
      } else {
        return result;
      }
    }
  ) => {
    //Verificacion de error devuelto
    resultErrorComprobation(result);
    //Si los datos de entrada son validos y no se devolvio error entonces
    console.log(result);
    res.status(200).json(onSucces(result));
  },
  validateResultForSelect: (
    result,
    res,
    onSucces = (result) => {
      return result;
    }
  ) => {
    //Verificacion de error devuelto
    resultErrorComprobation(result);
    //Si los datos de entrada son validos y no se devolvio error entonces
    console.log(result);
    //res.status(200).json({ success: true, data: onSucces(result) });
    res.status(200).json(onSucces(result));
  },
  validateResultForDelete: (
    result,
    res,
    onSucces = (result) => {
      console.log(result);
      return "Registro eliminado";
    }
  ) => {
    if(result.affectedRows==0){
      result = OurErrors.datosNoEncontrados();
    }
    //Verificacion de error devuelto
    resultErrorComprobation(result);
    //Si los datos de entrada son validos y no se devolvio error entonces
    console.log(result);
    //res.status(200).json({ success: true, data: onSucces(result) });
    res.status(200).json(onSucces(result));
  },
  validateResultForGeneral: (
    result,
    res,
    onComprobation=(result)=>{
      return true;
    },
    onSucces = (result) => {
      return result;
    },
    onFail = ()=>{
      throw new Error("Error en el proceso");
    }
  ) => {
    //Verificacion de error devuelto
    resultErrorComprobation(result);
    //Si los datos de entrada son validos y no se devolvio error entonces
    console.log(result);
    if(onComprobation(result)){
      res.status(200).json(onSucces(result));
    }
    else{
      onFail();
    }
    
  },
  sendError: (error, res) => {
    //Mostramos el error en consola de node
    console.log(error);
    //Si son errores personalizados se mandan respuestas personalizadas
    if (error.customErrno) {
      return res.status(error.responseState?error.responseState:500).json(error.message);
    }
    //Si es un error de node, se manda un mensaje predefinido
    else {
      return res
        .status(500)
        .json({ success: false, error: "Error de servidor" });
    }
  },

  ///Solo es una prueba de concepto...
  controllerMethod: async (req, res, bodyMethod=async(req, res)=>{}) =>{
    try {
      return await bodyMethod(req, res);
    } catch (error) {
      this.sendError(error,res)
    }
  }
};

function resultErrorComprobation(result) {
  if (result.errno || result.customErrno || result instanceof Error)
    throw result;
}
