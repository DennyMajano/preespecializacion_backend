const modelInforme = require("../../models/Informes/InformeMinisterialMensual.model");
const controller = require("../Controller");
module.exports = () => {
  let informe = {};
  informe.createCabeceraInforme = async (req, res) => {
    console.log(req.body);
    try {
      console.log(req.body);
      /* //si la comprobacion de campos no es apsada se envia al catch
      if(!DataComprobations.areFieldsValid([field,field])){
        throw OurErrors.faltanDatosError();
      } */
      req.body.usuarioToken = req.headers.authorization.split(" ")[1];
      console.log(req.body);
      const result = await modelInforme.createCabeceraInforme(req.body);
      console.log(result);
      //Validar resultado
      controller.validateResultForInsert(result, res, (result) => {
        return { id: result.insertId, code: result.code };
      });
    } catch (error) {
      controller.sendError(error, res);
    }
  };
  informe.createDetalleInforme = async (req, res) => {
    try {
      const result = await modelInforme.createDetalleInforme(req.body);
      controller.validateResultForInsert(result, res, (result) => {
        return { id: result.insertId, code: result.code };
      });
    } catch (error) {
      controller.sendError(error, res);
    }
  };
  informe.updateDetalleInforme = async (req, res) => {
    try {
      const result = await modelInforme.updateDetalleInforme(req.body);
      controller.validateResultForUpdate(result, res);
    } catch (error) {
      controller.sendError(error, res);
    }
  };
  informe.getAll = async (req, res) => {
    try {
      console.log(req.params);
      const result = await modelInforme.getAllPeriodosMinisteriales(
        req.params.filter
      );
      console.log(result);
      controller.validateResultForSelect(result, res);
    } catch (error) {
      controller.sendError(error, res);
    }
  };
  informe.getByState = async (req, res) => {
    try {
      console.log(req.params);
      const result = await modelInforme.getAllPeriodosMinisterialesByState(
        req.params.estado
      );
      console.log(result);
      controller.validateResultForSelect(result, res);
    } catch (error) {
      controller.sendError(error, res);
    }
  };
  informe.getByCodigoOrId = async (req, res) => {
    console.log(req.params);
    try {
      const result = await modelInforme.getPeriodoMinisterialByCodigoOrId(
        req.params.codigo
      );
      console.log(result);
      controller.validateResultForSelectOne(result, res);
    } catch (error) {
      controller.sendError(error, res);
    }
  };
  informe.isPeriodoMinisterialValidForFinalizar = async (
    req,
    res
  ) => {
    console.log(req.params);
    try {
      const result = await modelInforme.isPeriodoMinisterialValidToFinalizar(
        req.params.codigo
      );
      console.log(result);
      controller.validateResultForSelectOne(result, res);
    } catch (error) {
      controller.sendError(error, res);
    }
  };
  informe.finalizarPeriodo = async (req, res) => {
    try {
      console.log(req.body);
      const result = await modelInforme.setFinalizadoPeriodoMinisterial(
        req.body
      );
      console.log(result);
      controller.validateResultForUpdate(result, res);
    } catch (error) {
      controller.sendError(error, res);
    }
  };
  informe.ponerVigentePeriodo = async (req, res) => {
    try {
      console.log(req.body);
      const result = await modelInforme.setVigentePeriodoMinisterial(req.body);
      console.log(result);
      controller.validateResultForUpdate(result, res);
    } catch (error) {
      controller.sendError(error, res);
    }
  };
  informe.delete = async (req, res) => {
    try {
      console.log(req.body);
      const result = await modelInforme.deletePeriodo(req.body.id);
      console.log(result);
      controller.validateResultForDelete(result, res);
    } catch (error) {
      controller.sendError(error, res);
    }
  };
  return informe;
};
