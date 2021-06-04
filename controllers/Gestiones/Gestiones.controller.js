const controller = require("../Controller");
const modelGestiones = require("../../models/Gestiones/Gestiones.model");
const { validateResultForSelect } = require("../Controller");
const Token = require("../../services/security/Token");

module.exports = () => {
  let gestiones = {};
  gestiones.create = async (req, res) => {
    try {
      req.body.usuarioToken = req.headers.authorization.split(" ")[1];
      console.log(req.body);
      const result = await modelGestiones.create(req.body);
      console.log(result);
      controller.validateResultForInsert(result, res, (result) => {
        return { id: result.insertId, codigo: result.code };
      });
    } catch (error) {
      controller.sendError(error, res);
    }
  };
  gestiones.update = async (req, res) => {
    try {
      req.body.usuarioToken = req.headers.authorization.split(" ")[1];
      const result = await modelGestiones.update(req.body);
      controller.validateResultForUpdate(result, res);
    } catch (error) {
      controller.sendError(error, res);
    }
  };
  gestiones.delete = async (req, res) => {
    try {
      const result = await modelGestiones.delete(req.body.codigoGestion);
      controller.validateResultForDelete(result, res);
    } catch (error) {
      controller.sendError(error, res);
    }
  };
  gestiones.deleteAsignacionInforme = async (req, res) => {
    try {
      const result = await modelGestiones.deleteAsignacionInforme(req.body);
      controller.validateResultForDelete(result, res);
    } catch (error) {
      controller.sendError(error, res);
    }
  };

  gestiones.getByCodigoOrId = async (req, res) => {
    try {
      const result = await modelGestiones.getByCodigoOrId(req.params.codigo);
      console.log(result);
      controller.validateResultForSelectOne(result, res);
    } catch (error) {
      controller.sendError(error, res);
    }
  };

  gestiones.getGestionesActivas = async (req, res) => {
    try {
      const result = await modelGestiones.getGestionesActivas();
      validateResultForSelect(result, res);
    } catch (error) {
      controller.sendError(error, res);
    }
  };
  gestiones.getGestionesInactivas = async (req, res) => {
    try {
      const result = await modelGestiones.getGestionesInactivas();
      validateResultForSelect(result, res);
    } catch (error) {
      controller.sendError(error, res);
    }
  };
  gestiones.getInformesAsignados = async (req, res) => {
    try {
      const result = await modelGestiones.getInformesAsignados(
        req.params.codigo
      );
      controller.validateResultForSelect(result, res);
    } catch (error) {
      controller.sendError(error, res);
    }
  };
  gestiones.asignarInforme = async (req, res) => {
    try {
      const result = await modelGestiones.asignarInforme(req.body);
      controller.validateResultForInsert(result, res);
    } catch (error) {
      controller.sendError(error, res);
    }
  };
  gestiones.getIglesiasQueHanReportado = async (req, res) => {
    try {
      const result = await modelGestiones.getIglesiasQueHanReportado(
        req.params.codigo
      );
      controller.validateResultForSelect(result, res);
    } catch (error) {
      controller.sendError(error, res);
    }
  };
  gestiones.getDetalleDeInformesDeIglesiaAEnviar = async (req, res) => {
    try {
      const result = await modelGestiones.getDetalleDeInformesDeIglesia(
        req.params
      );

      controller.validateResultForSelect(result, res);
    } catch (error) {
      controller.sendError(error, res);
    }
  };
  gestiones.getDetalleDeInformesAEnviarDeIglesia = async (req, res) => {
    try {
      const result = await modelGestiones.getInformesAEnviarDeIglesia(
        req.params
      );

      controller.validateResultForSelect(result, res);
    } catch (error) {
      controller.sendError(error, res);
    }
  };
  gestiones.getActivasEnvioDeIglesias = async (req, res) => {
    try {
      const usuarioToken = req.headers.authorization.split(" ")[1];
      const persona = Token.decodeToken(usuarioToken).codigo_persona;
      const result = await modelGestiones.getActivasEnvioDeIglesias(
        req.params,
        persona
      );

      controller.validateResultForSelect(result, res);
    } catch (error) {
      controller.sendError(error, res);
    }
  };
  gestiones.publicarGestion = async (req, res) => {
    try {
      const result = await modelGestiones.publicarGestion(
        req.body.codigoGestion
      );
      controller.validateResultForUpdate(result, res);
    } catch (error) {
      controller.sendError(error, res);
    }
  };
  gestiones.cerrarGestion = async (req, res) => {
    try {
      const result = await modelGestiones.cerrarGestion(req.body.codigoGestion);
      controller.validateResultForUpdate(result, res);
    } catch (error) {
      controller.sendError(error, res);
    }
  };
  gestiones.guardarComprobanteDeposito = async (req, res) => {
    try {
      console.log("---------------1");
      console.log(req.body);
      //Obtenemos la ruta donde fue guardado el comprobante
      req.body.rutaImagen = req.file?req.file.path:"error_al_subir.png";
      //Llamamos el modelo
      const result = await modelGestiones.guardarComprobanteDeposito(req.body);
      //Validamos el resultado
      controller.validateResultForInsert(result, res);
    } catch (error) {
      controller.sendError(error, res);
    }
  };
  gestiones.getIglesiasConInformeEnviadoEnGestion = async (req, res) => {
    try {
      const result = await modelGestiones.getIglesiasConInformeEnviadoEnGestion(
        req.params
      );
      controller.validateResultForSelect(result, res);
    } catch (error) {
      controller.sendError(error, res);
    }
  };
  gestiones.getIglesiasConInformeNoEnviadoEnGestion = async (req, res) => {
    try {
      const result = await modelGestiones.getIglesiasConInformeNoEnviadoEnGestion(
        req.params
      );
      controller.validateResultForSelect(result, res);
    } catch (error) {
      controller.sendError(error, res);
    }
  };
  gestiones.template = async (req, res) => {
    try {
    } catch (error) {
      controller.sendError(error, res);
    }
  };
  return gestiones;
};
