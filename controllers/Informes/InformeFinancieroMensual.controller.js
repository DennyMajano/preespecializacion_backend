const modelInforme = require("../../models/Informes/InformeFinancieroMensual.model");
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
    console.log(req.body);
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
      console.log(req.body);
      req.body.usuarioToken = req.headers.authorization.split(" ")[1];
      const result = await modelInforme.updateDetalleInforme(req.body);
      controller.validateResultForUpdate(result, res);
    } catch (error) {
      controller.sendError(error, res);
    }
  };

  informe.getByCodigo = async (req, res) => {
    try {
      const result = await modelInforme.getInfoByCodigo(req.params.codigo);
      console.log(result);
      controller.validateResultForSelectOne(result, res);
    } catch (error) {
      controller.sendError(error, res);
    }
  };

  return informe;
};
