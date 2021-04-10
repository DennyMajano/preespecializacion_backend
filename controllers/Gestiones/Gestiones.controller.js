const controller = require("../Controller");
const modelGestiones = require("../../models/Gestiones/Gestiones.model");
const { validateResultForSelect } = require("../Controller");

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
  gestiones.getDetalleDeInformesDeIglesia = async (req, res) => {
    try {
      const result = await modelGestiones.getDetalleDeInformesDeIglesia(
        req.params
      );

      controller.validateResultForSelect(result, res);
    } catch (error) {
      controller.sendError(error, res);
    }
  };
  gestiones.getDetalleDeInformesDeIglesia = async (req, res) => {
    try {
      const result = await modelGestiones.getInformesAEnviarDeIglesia(
        req.params
      );

      controller.validateResultForSelect(result, res);
    } catch (error) {
      controller.sendError(error, res);
    }
  };
  gestiones.publicarGestion = async (req, res) => {
    try {
      const result = await modelGestiones.publicarGestion(req.body.codigoGestion);
      controller.validateResultForUpdate(result, res);
    } catch (error) {
      controller.sendError(error, res);
    }
  };
  gestiones.cerrarGestion = async (req, res) => {
    try {
      const result = await modelGestiones.publicarGestion(req.body.codigoGestion);
      controller.validateResultForUpdate(result, res);
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
