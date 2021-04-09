module.exports = {
  FALTAN_DATOS_ERROR: 1, //Una constante indicando el numero de error personalizado
  faltanDatosError: (message = "Faltan datos para ejecutar el proceso") => {
    return {
      customErrno: 1,
      message: message, //Mensaje personalizado al crear el error (tiene uno por defecto)
      responseState: 400, //codigo de http de Estado que se deberia responder
      error: new Error("Faltan datos para ejecutar el proceso."), //Instancia del error generado
    };
  },
  REQUERIMIENTOS_NO_PASADOS: 2, //Una constante indicando el numero de error personalizado
  requerimientosNoPasados: (
    message = "No se cumplen las los requisitos para ejecutar el proceso."
  ) => {
    return {
      customErrno: 2,
      message: message, //Mensaje personalizado al crear el error (tiene uno por defecto)
      responseState: 409, //codigo de http de Estado que se deberia responder
      error: new Error(
        "No se cumplen las los requisitos para ejecutar el proceso." //Instancia del error generado
      ),
    };
  },
  DATOS_NO_ENCONTRADOS: 3, //Una constante indicando el numero de error personalizado
  datosNoEncontrados: (
    message = "La información solicitada no fue encontrada"
  ) => {
    return {
      customErrno: 3,
      message: message, //Mensaje personalizado al crear el error (tiene uno por defecto)
      responseState: 404, //codigo de http de Estado que se deberia responder
      error: new Error(
        "La información solicitada no fue encontrada" //Instancia del error generado
      ),
    };
  },
};
