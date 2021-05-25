const modelInforme = require("../../models/Informes/Informe.model");
const controller = require("../Controller");
module.exports = () => {
  let informe = {};
  informe.setProcesado = async (req, res) => {
    try {
      const result = await modelInforme.SetProcesado(
        req.body.codigoInforme,
        req.headers.authorization.split(" ")[1]
      );
      controller.validateResultForUpdate(result, res);
    } catch (error) {
      controller.sendError(error, res);
    }
  };

  return informe;
};
