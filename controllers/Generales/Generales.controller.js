const modelGenerales = require("../../models/Generales/Generales.model");
module.exports = () => {
  let generales = {};

  generales.getSelectEstadoCivil = async (req, res) => {
    const { filter } = req.params;

    try {
      let result = await modelGenerales.findAllEstadoCivil(filter);
      if (result.errno) {
        res.status(500).json("Error de servidor");
      } else if (result.length >= 0) {
        res.status(200).json(result);
      }
    } catch (error) {
      res.status(500).json("Error de servidor");
    }
  };

  generales.getSelectDepartamento = async (req, res) => {
    const { filter } = req.params;

    try {
      let result = await modelGenerales.findAllDepartamento(filter);
      if (result.errno) {
        res.status(500).json("Error de servidor");
      } else if (result.length >= 0) {
        res.status(200).json(result);
      }
    } catch (error) {
      res.status(500).json("Error de servidor");
    }
  };
  generales.getSelectMunicipio = async (req, res) => {
    const { filter, dep } = req.params;

    try {
      let result = await modelGenerales.findAllMunicipios(filter, dep);
      if (result.errno) {
        res.status(500).json("Error de servidor");
      } else if (result.length >= 0) {
        res.status(200).json(result);
      }
    } catch (error) {
      res.status(500).json("Error de servidor");
    }
  };
  generales.getSelectCanton = async (req, res) => {
    const { filter, municipio } = req.params;

    try {
      let result = await modelGenerales.findAllCantones(filter, municipio);
      if (result.errno) {
        res.status(500).json("Error de servidor");
      } else if (result.length >= 0) {
        res.status(200).json(result);
      }
    } catch (error) {
      res.status(500).json("Error de servidor");
    }
  };
  generales.getSelectNacionalidad = async (req, res) => {
    const { filter } = req.params;

    try {
      let result = await modelGenerales.findAllNacionalidad(filter);
      if (result.errno) {
        res.status(500).json("Error de servidor");
      } else if (result.length >= 0) {
        res.status(200).json(result);
      }
    } catch (error) {
      res.status(500).json("Error de servidor");
    }
  };
  generales.getSelectProfesiones = async (req, res) => {
    const { filter } = req.params;

    try {
      let result = await modelGenerales.findAllProfesiones(filter);
      if (result.errno) {
        res.status(500).json("Error de servidor");
      } else if (result.length >= 0) {
        res.status(200).json(result);
      }
    } catch (error) {
      res.status(500).json("Error de servidor");
    }
  };
  generales.getSelectTipoIglesia = async (req, res) => {
    try {
      let result = await modelGenerales.findAllTipoIglesia();
      if (result.errno) {
        res.status(500).json("Error de servidor");
      } else if (result.length >= 0) {
        res.status(200).json(result);
      }
    } catch (error) {
      res.status(500).json("Error de servidor");
    }
  };
  generales.getSelectMiselanea = async (req, res) => {
    const { grupo } = req.params;

    try {
      let result = await modelGenerales.findAllMiselanea(grupo);
      if (result.errno) {
        res.status(500).json("Error de servidor");
      } else if (result.length >= 0) {
        res.status(200).json(result);
      }
    } catch (error) {
      res.status(500).json("Error de servidor");
    }
  };
  generales.getSelectTipoDocumento = async (req, res) => {
    try {
      let result = await modelGenerales.findAllTipoDocumento();
      if (result.errno) {
        res.status(500).json("Error de servidor");
      } else if (result.length >= 0) {
        res.status(200).json(result);
      }
    } catch (error) {
      res.status(500).json("Error de servidor");
    }
  };
  generales.getSelectTipoInforme = async (req, res) => {
    try {
      let result = await modelGenerales.findAllTipoInforme();
      if (result.errno) {
        res.status(500).json("Error de servidor");
      } else if (result.length >= 0) {
        res.status(200).json(result);
      }
    } catch (error) {
      res.status(500).json("Error de servidor");
    }
  };
  generales.getSelectMeses = async (req, res) => {
    try {
      let result = await modelGenerales.findAllMeses();
      if (result.errno) {
        res.status(500).json("Error de servidor");
      } else if (result.length >= 0) {
        res.status(200).json(result);
      }
    } catch (error) {
      res.status(500).json("Error de servidor");
    }
  };

  return generales;
};
