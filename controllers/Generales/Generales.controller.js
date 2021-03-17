const modelGenerales = require("../../models/Generales/Generales.model");
const isUndefinedOrNull = require("validate.io-undefined-or-null");
const mail = require("../../services/email/Mail");
module.exports = () => {
  let generales = {};

  generales.getSelectEstadoCivil = async (req, res) => {
    const { filter } = req.params;

    try {
      let result = await modelGenerales.findAllEstadoCivil(filter);
      console.log(result);
      if (result.errno) {
        res.status(500).json("Error de servidor");
      } else if (result.length >= 0) {
        res.status(200).json(result);
      }
    } catch (error) {
      console.log(error);
    }
  };

  generales.getSelectDepartamento = async (req, res) => {
    const { filter } = req.params;

    try {
      let result = await modelGenerales.findAllDepartamento(filter);
      console.log(result);
      if (result.errno) {
        res.status(500).json("Error de servidor");
      } else if (result.length >= 0) {
        res.status(200).json(result);
      }
    } catch (error) {
      console.log(error);
    }
  };
  generales.getSelectMunicipio = async (req, res) => {
    const { filter, dep } = req.params;

    try {
      let result = await modelGenerales.findAllMunicipios(filter, dep);
      console.log(result);
      if (result.errno) {
        res.status(500).json("Error de servidor");
      } else if (result.length >= 0) {
        res.status(200).json(result);
      }
    } catch (error) {
      console.log(error);
    }
  };
  generales.getSelectCanton = async (req, res) => {
    const { filter, municipio } = req.params;

    try {
      let result = await modelGenerales.findAllCantones(filter, municipio);
      console.log(result);
      if (result.errno) {
        res.status(500).json("Error de servidor");
      } else if (result.length >= 0) {
        res.status(200).json(result);
      }
    } catch (error) {
      console.log(error);
    }
  };
  generales.getSelectNacionalidad = async (req, res) => {
    const { filter } = req.params;

    try {
      let result = await modelGenerales.findAllNacionalidad(filter);
      console.log(result);
      if (result.errno) {
        res.status(500).json("Error de servidor");
      } else if (result.length >= 0) {
        res.status(200).json(result);
      }
    } catch (error) {
      console.log(error);
    }
  };
  generales.getSelectProfesiones = async (req, res) => {
    const { filter } = req.params;

    try {
      let result = await modelGenerales.findAllProfesiones(filter);
      console.log(result);
      if (result.errno) {
        res.status(500).json("Error de servidor");
      } else if (result.length >= 0) {
        res.status(200).json(result);
      }
    } catch (error) {
      console.log(error);
    }
  };
  generales.getSelectTipoIglesia = async (req, res) => {

    try {
      let result = await modelGenerales.findAllTipoIglesia();
      console.log(result);
      if (result.errno) {
        res.status(500).json("Error de servidor");
      } else if (result.length >= 0) {
        res.status(200).json(result);
      }
    } catch (error) {
      console.log(error);
    }
  };
  generales.getSelectMiselanea = async (req, res) => {
    const { grupo } = req.params;

    try {
      let result = await modelGenerales.findAllMiselanea(grupo);
      console.log(result);
      if (result.errno) {
        res.status(500).json("Error de servidor");
      } else if (result.length >= 0) {
        res.status(200).json(result);
      }
    } catch (error) {
      console.log(error);
    }
  };
  generales.getSelectTipoDocumento = async (req, res) => {
    try {
      let result = await modelGenerales.findAllTipoDocumento();
      console.log(result);
      if (result.errno) {
        res.status(500).json("Error de servidor");
      } else if (result.length >= 0) {
        res.status(200).json(result);
      }
    } catch (error) {
      console.log(error);
    }
  };
  generales.getSelectTipoInforme = async (req, res) => {
    try {
      let result = await modelGenerales.findAllTipoInforme();
      console.log(result);
      if (result.errno) {
        res.status(500).json("Error de servidor");
      } else if (result.length >= 0) {
        res.status(200).json(result);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return generales;
};
