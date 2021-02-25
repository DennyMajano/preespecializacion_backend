const modelPersonas = require("../../models/Personas/Personas.model");
const isUndefinedOrNull = require("validate.io-undefined-or-null");
const Encrytion = require("../../services/encrytion/Encrytion");

module.exports = () => {
  let personas = {};

  personas.insertOne = async (req, res) => {
    
    try {
      const data = req.body;
      data.avatar = req.file?req.file.path:"";
      console.log(req.file);
      if (!isUndefinedOrNull(data.nombre) &&!isUndefinedOrNull(data.apellido) && !isUndefinedOrNull(data.direccion)) {
        let result = await modelPersonas.create(data);
        res.status(200).json({result});
      } else {
        res.status(400).json("Faltan datos para realizar el proceso");
      }
    } catch (error) {
      console.log(error);
      res.status(500).json("Error de servidor");
    }
  };

  personas.getById = async (req, res) => {
    const { code } = req.params;
    console.log(code);
    try {
      const result = await modelPersonas.findById(code);

      if (result.errno || result instanceof Error) {
        throw result;
      } else {
        res.status(result===false?404:200).json({estado: result});
      } 
    } catch (error) {
      console.log(error);
      res.status(500).json("Error de servidor");
    }
  };

  personas.updateAvatar = async (req, res) => {
    try {
      if(!isUndefinedOrNull( req.body.userId) && !isUndefinedOrNull(req.file)){

        const data = req.body;
        data.avatar = req.file;
        data.user = await modelPersonas.findById(req.body.userId);
        console.log(data);
        const result = await modelPersonas.updateProfilePicture(data);
        console.log(result);
        if(result.errno || result instanceof Error){
          console.log("ERRO");
          throw result;
        }
        else{
          console.log("ERRO1");
          res.status(200).json({estado: result});
        }
      }
      else{
        res.status(400).json("Faltan datos");
      }

    } catch (error) {
      console.log(error);
      res.status(500).json("Error de servidor");
    }
  }

  //-----------------

  personas.updateOne = async (req, res) => {
    const data = req.body;
    console.log(data);
    try {
      if (!isUndefinedOrNull(data.code) && !isUndefinedOrNull(data.name)) {
        let result = await modelPersonas.update(data);
        if (result.errno) {
          console.log(result);
          res.status(500).json("Error de servidor");
        } else if (result.affectedRows === 1) {
          res.status(200).json("Se actualizo con exito");
        } else {
          res.status(400).json("No se pudo actualizar");
        }
      } else {
        res.status(400).json("faltan datos para realizar el proceso");
      }
    } catch (error) {
      console.log(error);
    }
  };

  personas.getAll = async (req, res) => {
    const { filter } = req.params;
    console.log(filter);
    try {
      let result = await modelPersonas.findAll(filter);
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

  personas.getSelect = async (req, res) => {
    const { filter } = req.params;

    try {
      let result = await modelPersonas.findSelect(filter);

      if (result.code) {
        res.status(500).json({
          message: "Error servidor",
          erro_code: result.code,
        });
      } else if (result.length >= 0) {
        res.status(200).json(result);
      }
    } catch (error) {
      console.log(error);
    }
  };
 
  personas.DisableOrEnable = async (req, res) => {
    const data = req.body;
    console.log(data);
    try {
      if (!isUndefinedOrNull(data.status) && !isUndefinedOrNull(data.code)) {
        let result = await modelPersonas.disableOrEnable(data);
        if (result.errno) {
          res.status(500).json("Error de servidor");
        } else if (result.affectedRows === 1) {
          res.status(200).json("Proceso se realizó con exito");
        } else {
          res.status(400).json("No se pudo realiar el proceso");
        }
      } else {
        res.status(400).json("faltan datos para realizar el proceso");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return personas;
};
