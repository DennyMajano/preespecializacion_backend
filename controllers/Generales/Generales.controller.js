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
  generales.getSelectSexo = async (req, res) => {
    try {
      let result = await modelGenerales.findAllSexo();
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
  generales.getSelectTipoDocumentoIdentificacion = async (req, res) => {
    try {
      let result = await modelGenerales.findAllTipoDocumentoIdentificacion();
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
  generales.getSelectMotivosBaja = async (req, res) => {
    try {
      let result = await modelGenerales.findAllMotivosBaja();
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
  generales.getSelectTiposSaldos = async (req, res) => {
    try {
      let result = await modelGenerales.findAllTiposSaldo();
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
  generales.getSelectTipoCuenta = async (req, res) => {
    try {
      let result = await modelGenerales.findAllTipoCuenta();
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
  generales.getSelectTipoProyecto = async (req, res) => {
    try {
      let result = await modelGenerales.findAllTipoProyecto();
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
  generales.mail = async (req, res) => {
    const { mensaje } = req.params;

    try {
      let info = await mail.send(
        "Mensaje de prueba",
        "arielopez229422@gmail.com",
        "PRUEBA",
        mensaje
      );
      res.status(200).json({ info });
    } catch (error) {
      res.status(500).json({ info: "Error al enviar el mensaje" });
    }
  };

  return generales;
};
