const database = require("../../config/database.async");
const db = require("../../config/conexion");
const GeneratorCode = require("../../helpers/GeneratorCode");
const fse = require("fs-extra");
module.exports = {


  /**
   * @returns Si la persona se registra exitosamente devuelve el `id` de la persona registrada, en caso contrario devuelve `false`
   * @param {*} PersonaData - Recibe todos los datos de la persona nueva a registrarse.
   * @param {*} callback- Callback a ejecutarse cuando se registre usuario;
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
  find: async (filter = "") => {
    let personas;
    try {
      const transactionResult = await database.Transaction(
        db, 
        async () => {
          if (filter != "") {
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
  
  update: async (data) => {
    const { code, name } = data;
    let roles;
    let transaction;
    try {
      transaction = await database.Transaction(db, async () => {
        roles = await db.query(`UPDATE roles SET nombre=? WHERE id=?`, [
          name,
          code,
        ]);
      });
    } catch (error) {
      return error;
    }

    return roles !== undefined ? roles : transaction;
  },



  findSelect: async (filter = "") => {
    let personas;
    let transaction;
    let data_roles;
    try {
      transaction = await database.Transaction(db, async () => {
        if (filter != "") {
          filter = filter.split(" ");

          let query = `SELECT id, codigo, CONCAT( nombres,' ',apellidos) AS nombre FROM personas WHERE condicion=1 AND estado=1`;

          for (let i = 0; i < filter.length; i++) {
            query += ` AND (nombres LIKE '%${filter[i]}%' OR apellidos LIKE '%${filter[i]}%' OR codigo LIKE '%${filter[i]}%')`;
          }

          personas = personas = await db.query(
            `${query} ORDER BY nombre ASC LIMIT 50`
          );
        } else {
          personas = await db.query(
            `SELECT id, codigo, CONCAT( nombres,' ',apellidos) AS nombre FROM personas WHERE condicion=1 AND estado=1`
          );
        }

        if (!personas.code) {
          data_roles = personas.map((element) => {
            return {
              id: element.id,
              codigo: element.codigo,
              nombre: element.nombre,
            };
          });
        }
      });
    } catch (error) {
      return error;
    }

    return personas !== undefined
      ? personas.errno
        ? data_roles
        : personas
      : transaction;
  },

  disableOrEnable: async (data) => {
    const { status, code } = data;
    let modulo;
    let transaction;

    try {
      transaction = await database.Transaction(db, async () => {
        modulo = await db.query(`UPDATE roles SET condicion=? WHERE id=?`, [
          status,
          code,
        ]);
      });
    } catch (error) {
      return error;
    }

    return modulo !== undefined ? modulo : transaction;
  },
};
