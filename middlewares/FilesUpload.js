const path = require("path");
const crypto = require("crypto");
const multer = require("multer");
const Token = require("../services/security/Token");
const fse = require("fs-extra");


const allowedImageExtensions = [".png", ".jpg", ".jpeg"]; //Extensiones permitidas para imágenes
const allowedFileExtensions = [".pdf"]; //Extensiones permitidas para archivos

//Para validar extensiones de imágenes
/** 
*
@param {string} extension - La extensión a evaluar si está permitida.
@returns {boolean} true si está permitida, false si no está permitida.
*/
function isAllowedImageExtension(extension) {
    return allowedImageExtensions.some(extensionAllowed => extensionAllowed == extension);
}
//Para validar extensiones de archivos
/** 
*
@param {string} extension - La extensión a evaluar si está permitida.
@returns {boolean} true si está permitida, false si no está permitida.
*/
function isAllowedFileExtension(extension){
    return allowedFileExtensions.some(extensionAllowed => extensionAllowed == extension);
}
//Para validar extensiones de cualquier
/** 
*
@param {string} extension - La extensión a evaluar si está permitida.
@returns {boolean} true si está permitida, false si no está permitida.
*/
function isAllowedExtension(extension){
    return isAllowedImageExtension(extension) || isAllowedFileExtension(extension);
}

/**
 * 
 * @param {string} token - El token del usuario de donde se obtiene la información
 * @returns {string} Devuelve la carpeta del usuario
 */
function getUserFolder(token){
    const decodedToken = Token.decodeToken(token);
    console.log(decodedToken.usuario);
    if (decodedToken === 0)
        throw new Error("No se pueden obtener la carpeta del usuario");
    return decodedToken.usuario.toString();
   
}



module.exports ={

    /**
     * @returns Retorna el middleware para subir un único archivo.
     * @param {string} pathToSaveFile - Ruta donde se guardará el archiva relativo al directorio "recursos/"" (la carpeta raíz donde se guardan los archivos), si `isForUser` es true la ruta será relativa a la carpeta del usuario que realiza la acción.
     * @param {string} inputFileName - Nombre del campo que contiene el archivo
     * @param {boolean} isForUser - Por defecto es false, si se indica como true, especifíca que el parámetro `pathToSaveFile` sera relativa a la carpeta del usuario que realiza l acción.
     * 
     */
    uploadSingle:(pathToSaveFile,inputFileName, isForUser = false) => {
        try {
            const storage = multer.diskStorage(
                {
                    destination:  (req, file, callback) => {
                        let folder;
                        if(isForUser)
                            folder = path.join(process.env.PATH_USERS_FOLDER,getUserFolder(req.headers.authorization.split(" ")[1]),pathToSaveFile);
                        else
                            folder = path.join(process.env.PATH_PUBLIC_FOLDER,pathToSaveFile);
                        fse.ensureDirSync(folder); //nos aseguramos que el directorio exista
                        callback(null, folder); //directorio donde se va guardar la imagen
                    }, 
                    filename: (req, file, callback) => {
                          //Configuración para poner nombre a la imagen
                          crypto.pseudoRandomBytes(16, (err, raw) => {
                            callback(
                                null,
                                raw.toString("hex") + Date.now() + path.extname(file.originalname)
                              ); //encriptacion+fechaActual+.extencion
                          });
                    }
                }
            );
        
            const upload = multer(
                {
                    storage,
                    limits: 10000,
                    fileFilter: (req, file, callback) => {
                        const extensionOfFile = path.extname(file.originalname).toLowerCase();
                        isAllowedExtension(extensionOfFile) //¿Es una extension permitida?
                        ? callback(null, true)
                        : callback(new Error("El tipo de archivo no es permitido"));
                    },
                }
            );
            return upload.single(inputFileName); //nombre el input que trae el archivo;
        } catch (error) {
            console.error(error);
        }
      },
    /**
     * @returns Retorna el middleware para subir un único archivo.
     * @param {string} pathToSaveFile - Ruta donde se guardará el archiva relativo al directorio "recursos/"" (la carpeta raíz donde se guardan los archivos), si `isForUser` es true la ruta será relativa a la carpeta del usuario que realiza la acción.
     * @param {string} inputFileName - Nombre del campo que contiene el archivo.
     * @param {number} maxAmountFiles - Cantidad máxima de archivos a procesar.
     * @param {boolean} isForUser - Por defecto es false, si se indica como true, especifíca que el parámetro `pathToSaveFile` sera relativa a la carpeta del usuario que realiza l acción.
     * 
    */
    uploadMultiple: (pathToSaveFile,inputFileName,maxAmountFiles, isForUser = false) => {
        try {
            const storage = multer.diskStorage(
                {
                    destination:  (req, file, callback) => {
                        let folder;
                        if(isForUser)
                            folder = path.join(process.env.PATH_USERS_FOLDER,getUserFolder(req.headers.authorization.split(" ")[1]),pathToSaveFile);
                        else
                            folder = path.join(process.env.PATH_PUBLIC_FOLDER,pathToSaveFile);
                        fse.ensureDirSync(folder); //nos aseguramos que el directorio exista
                        callback(null, folder); //directorio donde se va guardar la imagen
                    }, 
                    filename: (req, file, callback) => {
                          //Configuración para poner nombre a la imagen
                          crypto.pseudoRandomBytes(16, (err, raw) => {
                            callback(
                                null,
                                raw.toString("hex") + Date.now() + path.extname(file.originalname)
                              ); 
                          });
                    }
                }
            );
        
            const upload = multer(
                {
                    storage,
                    limits: 10000,
                    fileFilter: (req, file, callback) => {
                        const extensionOfFile = path.extname(file.originalname).toLowerCase();
                        isAllowedExtension(extensionOfFile) //¿Es una extension permitida?
                        ? callback(null, true)
                        : callback(new Error("El tipo de archivo no es permitido"));
                    },
                }
            );
            return upload.array(inputFileName,maxAmountFiles)
        } catch (error) {
            console.error(error)
        } 
    }
      
  }