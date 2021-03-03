const database = require("../../config/database.async");
const db = require("../../config/conexion");
const GeneratorCode = require("../../helpers/GeneratorCode");
const fse = require("fs-extra");
const isUndefinedOrNull = require("validate.io-undefined-or-null/lib");
module.exports = {


  /**
   * @returns Si la persona se registra exitosamente devuelve el `id` de la persona registrada, en caso contrario devuelve `false`
   * @param {*} PersonaData - Recibe todos los datos de la persona nueva a registrarse.
   * @param {*} [callback]- Callback a ejecutarse cuando se registre usuario;
   */
  create: async (PersonaData, callback) => {
    const { 
      nombre, 
      apellido, 
      telefono, 
      sexo, 
      avatar, 
      nacionalidad, 
      fechaNacimiento, 
      departamentoNacimiento,  
      municipioNacimiento,
      cantonNacimiento,
      departamentoResidencia,
      municipioResidencia,
      cantonResidencia,
      tipoDocumento,
      numeroDocumento,
      estadoCivil,
      profesion,
      direccion,
      createUser,
      iglesia,
      correo_electronico,
      rol,
      alias

    } = PersonaData;

    try {

      let result;

      const transactionResult = await database.Transaction(
        db,
        async () =>{
          const newPersonaCode = GeneratorCode("P");
          const personaResult = await db.query(
            "INSERT INTO `personas`(`codigo`,`nombres`, `apellidos`, `telefono`, `sexo`, `avatar`, `nacionalidad`, `fecha_nacimiento`, `departemento_nacimiento`, `municipio_nacimiento`, `canton_nacimiento`, `departamento_residencia`, `municipio_residencia`, `canton_residencia`, `tipo_documento`, `numero_documento`, `estado_civil`, `profesion_oficio`, `direccion`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
            [
              newPersonaCode,
              nombre, 
              apellido, 
              telefono, 
              sexo, 
              avatar, 
              nacionalidad, 
              fechaNacimiento, 
              departamentoNacimiento,  
              municipioNacimiento,
              cantonNacimiento,
              departamentoResidencia,
              municipioResidencia,
              cantonResidencia,
              tipoDocumento,
              numeroDocumento,
              estadoCivil,
              profesion,
              direccion
            ]
          );
            console.log(personaResult);
          if(personaResult.affectedRows > 0){
            console.log("-------------------ID OF PERSON");
            console.log(personaResult);
            if(createUser == true){
              const userResult = await callback({
                persona: newPersonaCode,
                iglesia,
                correo_electronico,
                rol,
                alias
              });

              if(userResult.affectedRows > 0){
                result = personaResult.insertId;
              }
              else{
                throw new Error("No se pudo crear el usuario");
              }
            }
            else{
              result = personaResult.insertId;
            }

          }
          else{
            result = false;
          }
          
        }
        );
        if(transactionResult.errno){
          throw transactionResult;
        }
        return result;
    } catch (error) {
      console.log(error);
      return error;
    }
   
  },

  /**
   * @returns Si la persona es encontrada se devuelve un `object` de la persona, de lo contrario se devuelve `false`
   * @param {string} code - Es el id, codigo o numero de documento de la persona a buscar
   */
  findById: async (code) => {
    try {
      let personaFound;
      const transactionResult = await database.Transaction(
        db,
        async () => {
          const personaResult = await db.query(
            "select * from personas where id = ? OR codigo = ? OR numero_documento = ? LIMIT 1",
            [code,code,code]
          );

          if(personaResult.length>0){
            personaFound = personaResult[0];
          }
          else{
            personaFound = false;
          }
        }
      );

      if(transactionResult.errno || transactionResult instanceof Error){
        throw transactionResult;
      }
      return personaFound;

    } catch (error) {
      return error;
    }
  },

  /**
   * @returns Devuelve un `booleano` indicando si se actualizo o no la foto de perfil.
   * @param {*} data - Datos sobre el usuario y el nuevo archivo guardado a actualizarse en el usuario.
   */
  updateProfilePicture: async(data)=>{
    const {user, avatar} = data;
    try {
      let result;
      console.log(user.avatar);
      await fse.remove(user.avatar)

      const transactionResult = await database.Transaction(
        db,
        async ()=>{
          console.log("xxxxxxxxxxxxxxxxxxxxxxxxx");
          console.log(user.id);
          const updateAvatarResult = await db.query(
            "UPDATE `personas` SET `avatar`= ?  WHERE `id`=?",
            [avatar.path, user.id]
          );
          console.log("-------------------aaa");
          console.log(updateAvatarResult);
          result = updateAvatarResult.affectedRows > 0;
        }
      );
      
      if(transactionResult.errno || transactionResult instanceof Error){
        throw Error;
      }
      console.log("--------------------result");
      console.log(result);
      return result;
    } catch (error) {
      return error;
    }
  },
  /**
   * @returns Devuelve la lista de personas que cumplan con `filter`. Cuando no se pasa `filter` se devuelven todos sin filtrar.
   * @param {string} filter - Opcional. Cadena a buscar en los campos de Personas. 
   */
  findAll: async (filter = "") => {
    let personas;
    try {
      const transactionResult = await database.Transaction(
        db, 
        async () => {
          if (filter != "" || !isUndefinedOrNull(filter)) {
            console.log("_-------------------------AKI");
            filter = filter.split(" ");

            let query = `SELECT * FROM personas WHERE `;
            for (let i = 0; i < filter.length; i++) {
              query += 
              `(nombres LIKE '%${filter[i]}%' OR apellidos LIKE '%${filter[i]}%' OR numero_documento LIKE '%${filter[i]}%' OR codigo LIKE '%${filter[i]}%' OR telefono LIKE '%${filter[i]}%') ${i + 1 - filter.length >= 0 ? "" : "AND"}`;
            }
            console.log(query);
            personas = await db.query(`${query} ORDER BY nombres ASC LIMIT 100`);
            console.log(personas);
          } else {
            console.log("todos");
            personas = await db.query(
              `SELECT * FROM personas ORDER BY nombres ASC LIMIT 100`
            );
          }

         
      });
      if(transactionResult.errno || transactionResult instanceof Error){
        throw transactionResult;
      }
      return personas;
    } catch (error) {
      return error;
    }

  },
  
  /**
   * @returns Devuelve un `boolean` indicando `true` si ya existe y `false` si no existe.
   * @param {string} phoneNumber - Número del telefono a saber si existe o no
   */
  findPhoneNumber: async(phoneNumber) =>{
    try {
      let result;
      const transactionResult = await database.Transaction(
        db,
        async ()=>{
          const queryResult = await db.query(
            "select telefono from personas where telefono = ?",
            [phoneNumber]
          );
          result =  queryResult
        }
      );

      if(transactionResult.errno || transactionResult instanceof Error){
        throw transactionResult;
      }
      console.log("----------------");
      console.log(result);
      return result;
    } catch (error) {
      return error;
    }
  },

  /**
   * @returns Devuelve un `boolean` indicando `true` si ya existe y `false` si no existe.
   * @param {string} documentNumber - Número de documento a saber si existe o no
   */
  findDocumentNumber: async(documentNumber) =>{
    try {
      let result;
      const transactionResult = await database.Transaction(
        db,
        async ()=>{
          const queryResult = await db.query(
            "select numero_documento from personas where numero_documento = ?",
            [documentNumber]
          );
          result =  queryResult;
        }
      );

      if(transactionResult.errno || transactionResult instanceof Error){
        throw transactionResult;
      }
      console.log("----------------");
      console.log(result);
      return result;
    } catch (error) {
      return error;
    }
  },

  /**
   * 
   * @param {Object} data - Datos para habilitar o deshabilitar el registro
   * @param {number} data.code - `id` de la persona a modificar
   * @param {number} data.status - 1 para habilitar, 0 para deshabilitar
   */
  disableOrEnable: async(data) =>{
    try {
      let result;
      const transactionResult = await database.Transaction(
        db,
        async ()=>{
          const queryResult = await db.query(
            "UPDATE personas SET condicion=? WHERE id=?",
            [data.status, data.code]
          );
          console.log(queryResult);
          result = queryResult.affectedRows >0;
        }
      );

      if(transactionResult.errno || transactionResult instanceof Error){
        throw transactionResult;
      }
      return result;
    } catch (error) {
      return error;
    }
  },

  /**
   * Función para buscar en las personas que están habilitadas y que están vivas.
   * @returns Devuelve la lista de personas que cumplan con `filter`. Cuando no se pasa `filter` se devuelven todos sin filtrar.
   * @param {string} filter - Opcional. Cadena a buscar en los campos de Personas. 
   */
  findAllInOk: async (filter = "") => {
    let personas;
    try {
      const transactionResult = await database.Transaction(
        db, 
        async () => {
          if (filter != "") {
            filter = filter.split(" ");

            let query = `SELECT * FROM personas WHERE (condicion = 1 AND estado = 1) AND `;
            for (let i = 0; i < filter.length; i++) {
              query += 
              `(nombres LIKE '%${filter[i]}%' OR apellidos LIKE '%${filter[i]}%' OR numero_documento LIKE '%${filter[i]}%' OR codigo LIKE '%${filter[i]}%' OR telefono LIKE '%${filter[i]}%') ${i + 1 - filter.length >= 0 ? "" : "AND"}`;
            }
            console.log(query);
            personas = await db.query(`${query} ORDER BY nombres ASC LIMIT 100`);
            console.log(personas);
          } else {
            console.log("todos");
            personas = await db.query(
              `SELECT * FROM personas WHERE condicion = 1 AND estado = 1 ORDER BY nombres ASC LIMIT 100`
            );
          }

         
      });
      if(transactionResult.errno || transactionResult instanceof Error){
        throw transactionResult;
      }
      return personas;
    } catch (error) {
      return error;
    }

  },
  
    /**
   * 
   * @param {Object} data - Datos para habilitar o deshabilitar el registro
   * @param {number} data.code - `id` de la persona a modificar
   * @param {number} data.status - 1 para habilitar, 0 para deshabilitar
   */
  disableOrEnable: async(data) =>{
    try {
      let result;
      const transactionResult = await database.Transaction(
        db,
        async ()=>{
          const queryResult = await db.query(
            "UPDATE personas SET condicion=? WHERE id=?",
            [data.status, data.code]
          );
          console.log(queryResult);
          result = queryResult.affectedRows >0;
        }
      );

      if(transactionResult.errno || transactionResult instanceof Error){
        throw transactionResult;
      }
      return result;
    } catch (error) {
      return error;
    }
  },
  /**
   * Función para buscar en las personas que están habilitadas y que están vivas.
   * @returns Devuelve la lista de personas que cumplan con `filter`. Cuando no se pasa `filter` se devuelven todos sin filtrar.
   * @param {string} filter - Opcional. Cadena a buscar en los campos de Personas. 
   */
  findSelect: async (filter = "") => {
    let personas;
    try {
      const transactionResult = await database.Transaction(
        db, 
        async () => {
          if (filter != "") {
            filter = filter.split(" ");

            let query = "SELECT id, codigo, concat(nombres, ' ', apellidos) as nombre FROM `personas` WHERE condicion = 1 AND estado = 1 ";
            for (let i = 0; i < filter.length; i++) {
              query += 
              `AND (nombres LIKE '%${filter[i]}%'
              OR apellidos LIKE '%${filter[i]}%')`;
            }
            console.log(query);
            personas = await db.query(`${query} ORDER BY nombre ASC LIMIT 50`);
            console.log(personas);
          } else {
            console.log("todos");
            personas = await db.query(
             "SELECT id, codigo, concat(nombres, ' ', apellidos) as nombre FROM `personas` WHERE condicion = 1 AND estado = 1 ORDER BY nombre ASC LIMIT 50"
            );
          }

         
      });
      if(transactionResult.errno || transactionResult instanceof Error){
        throw transactionResult;
      }
      return personas;
    } catch (error) {
      return error;
    }

  },
    
    /**
   * 
   * @param {Object} data - Datos para habilitar o deshabilitar el registro
   * @param {number} data.code - `id` de la persona a modificar
   * @param {string} data.date - `Fecha` en la que falleció la persona
   */
  setDied: async(data) =>{
    try {
      let result;
      const transactionResult = await database.Transaction(
        db,
        async ()=>{
          const queryResult = await db.query(
            "UPDATE personas SET estado=2, condicion=0, fecha_fallecimiento = ? WHERE id=?",
            [data.date,data.code]
          );
          console.log(queryResult);
          result = queryResult.affectedRows >0;
        }
      );

      if(transactionResult.errno || transactionResult instanceof Error){
        throw transactionResult;
      }
      return result;
    } catch (error) {
      return error;
    }
  },

  
  /**
   * @returns Si la persona se registra exitosamente devuelve el `id` de la persona registrada, en caso contrario devuelve `false`
   * @param {*} PersonaData - Los datos a actualizar de la persona.
   * @param {*} [callback]- Callback a ejecutarse cuando se registre usuario;
   */
  update: async (PersonaData) => {
    const { 
      nombre, 
      apellido, 
      telefono, 
      sexo,  
      nacionalidad, 
      fechaNacimiento, 
      departamentoNacimiento,  
      municipioNacimiento,
      cantonNacimiento,
      departamentoResidencia,
      municipioResidencia,
      cantonResidencia,
      tipoDocumento,
      numeroDocumento,
      estadoCivil,
      profesion,
      direccion,
      code,
    } = PersonaData;

    try {

      let result;

      const transactionResult = await database.Transaction(
        db,
        async () =>{
          const personaResult = await db.query(
            "UPDATE `personas` SET `nombres`=?,`apellidos`=?,`telefono`=?,`sexo`=?,`nacionalidad`=?,`fecha_nacimiento`=?,`departemento_nacimiento`=?,`municipio_nacimiento`=?,`canton_nacimiento`=?,`departamento_residencia`=?,`municipio_residencia`=?,`canton_residencia`=?,`tipo_documento`=?,`numero_documento`=?,`estado_civil`=?,`profesion_oficio`=?,`direccion`=? WHERE id=?",
            [
              nombre, 
              apellido, 
              telefono, 
              sexo,  
              nacionalidad, 
              fechaNacimiento, 
              departamentoNacimiento,  
              municipioNacimiento,
              cantonNacimiento,
              departamentoResidencia,
              municipioResidencia,
              cantonResidencia,
              tipoDocumento,
              numeroDocumento,
              estadoCivil,
              profesion,
              direccion,
              code
            ]
          );
            console.log(personaResult);
          result = personaResult;
          
        }
        );
        if(transactionResult.errno){
          throw transactionResult;
        }
        return result;
    } catch (error) {
      console.log(error);
      return error;
    }
   
  },


  template: async(params) =>{
    try {
      let result;
      const transactionResult = await database.Transaction(
        db,
        async ()=>{
          //cosas
          const queryResult = await db.query(
            "",
            []
          );

          //result = queryResult.affectedRows > 0;
          /**
           * if(queryResult.length > 0){
           *  
           * }
           */
        }
      );

      if(transactionResult.errno || transactionResult instanceof Error){
        throw transactionResult;
      }
      return result;
    } catch (error) {
      return error;
    }
  }
};
