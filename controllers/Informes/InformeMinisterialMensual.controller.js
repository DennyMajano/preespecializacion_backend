const modelInforme = require("../../models/Informes/InformeMinisterialMensual.model");
const controller = require("../Controller");
module.exports = () => {
  let informe = {};

  informe.getByCodigo = async (req, res) => {
    try {
      const result = await modelInforme.getInfoByCodigo(req.params.codigo);
      controller.validateResultForSelectOne(result, res);
    } catch (error) {
      controller.sendError(error, res);
    }
  };
  informe.create = async (req, res) => {
    console.log(req.body);
    try {
      req.body.cabecera.usuarioToken = req.headers.authorization.split(" ")[1];
      const result = await modelInforme.create(req.body);

      controller.validateResultForGeneral(result, res);
    } catch (error) {
      controller.sendError(error, res);
    }
  };
  informe.update = async (req, res) => {
    try {
      console.log(req.body);
      req.body.usuarioToken = req.headers.authorization.split(" ")[1];
      const result = await modelInforme.update(req.body);
      controller.validateResultForGeneral(result, res);
    } catch (error) {
      controller.sendError(error, res);
    }
  };

  return informe;
};
