const modelPeriodos = require("../../models/PeriodosMinisteriales/PeriodosMinisteriales.model");
const controller = require("../Controller");
module.exports = () => {
  let periodosministeriales = {};
  periodosministeriales.create = async (req, res) => {
    console.log(req.body);
    try {
      console.log(req.body);
      /* //si la comprobacion de campos no es apsada se envia al catch
      if(!DataComprobations.areFieldsValid([field,field])){
        throw OurErrors.faltanDatosError();
      } */
      const result = await modelPeriodos.create(req.body);
      console.log(result);
      //Validar resultado
      controller.validateResultForInsert(result, res, (result) => {
        return { id: result.insertId, code: result.code };
      });
    } catch (error) {
      controller.sendError(error, res);
    }
  };
  periodosministeriales.update = async (req, res) => {
    try {
      console.log(req.body);
      const result = await modelPeriodos.update(req.body);
      console.log(result);
      controller.validateResultForUpdate(result, res);
    } catch (error) {
      controller.sendError(error, res);
    }
  };
  periodosministeriales.getAll = async (req, res) => {
    try {
      console.log(req.params);
      const result = await modelPeriodos.getAllPeriodosMinisteriales(
        req.params.filter
      );
      console.log(result);
      controller.validateResultForSelect(result, res);
    } catch (error) {
      controller.sendError(error, res);
    }
  };
  periodosministeriales.getByState = async (req, res) => {
    try {
      console.log(req.params);
      const result = await modelPeriodos.getAllPeriodosMinisterialesByState(
        req.params.estado
      );
      console.log(result);
      controller.validateResultForSelect(result, res);
    } catch (error) {
      controller.sendError(error, res);
    }
  };
  periodosministeriales.getByCodigoOrId = async (req, res) => {
    console.log(req.params);
    try {
      const result = await modelPeriodos.getPeriodoMinisterialByCodigoOrId(
        req.params.codigo
      );
      console.log(result);
      controller.validateResultForSelectOne(result, res);
    } catch (error) {
      controller.sendError(error, res);
    }
  };
  periodosministeriales.isPeriodoMinisterialValidForFinalizar = async (
    req,
    res
  ) => {
    console.log(req.params);
    try {
      const result = await modelPeriodos.isPeriodoMinisterialValidToFinalizar(
        req.params.codigo
      );
      console.log(result);
      controller.validateResultForSelectOne(result, res);
    } catch (error) {
      controller.sendError(error, res);
    }
  };
  periodosministeriales.finalizarPeriodo = async (req, res) => {
    try {
      console.log(req.body);
      const result = await modelPeriodos.setFinalizadoPeriodoMinisterial(
        req.body
      );
      console.log(result);
      controller.validateResultForUpdate(result, res);
    } catch (error) {
      controller.sendError(error, res);
    }
  };
  periodosministeriales.ponerVigentePeriodo = async (req, res) => {
    try {
      console.log(req.body);
      const result = await modelPeriodos.setVigentePeriodoMinisterial(req.body);
      console.log(result);
      controller.validateResultForUpdate(result, res);
    } catch (error) {
      controller.sendError(error, res);
    }
  };
  periodosministeriales.delete = async (req, res) => {
    try {
      console.log(req.body);
      const result = await modelPeriodos.deletePeriodo(req.body.id);
      console.log(result);
      controller.validateResultForDelete(result, res);
    } catch (error) {
      controller.sendError(error, res);
    }
  };
  return periodosministeriales;
};
