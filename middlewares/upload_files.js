const path = require("path");
const crypto = require("crypto");
const multer = require("multer");
function isAllowedImage(extension) {
  return (
    extension === ".png" ||
    extension === ".jpg" ||
    extension === ".jpeg" ||
    extension === ".pdf"
  );
}
module.exports = {
  /**
   * @ ruta donde se va a guardar, nombre de la carpeta donde se va guardar, nombre del input que lo envia
   */
  upload_file: (path_to_save, folder_to_save, input_name) => {
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, path_to_save + "/" + folder_to_save);
      }, //directorio donde se va guardar la imagen
      filename: function (req, file, cb) {
        //Configuracion para poner nombre a la imagen

        crypto.pseudoRandomBytes(16, function (err, raw) {
          cb(
            null,
            raw.toString("hex") + Date.now() + path.extname(file.originalname)
          ); //encriptacion+fechaActual+.extencion
        });
      },
    });

    const uploadImage = multer({
      storage,
      limits: 10000,
      fileFilter: function (req, file, cb) {
        let extension = path.extname(file.originalname).toLowerCase();
        isAllowedImage(extension)
          ? cb(null, true)
          : cb(new Error("SOLO PNG; JPEG; JPG"));
      },
    }).single(input_name); //nombre el input que trae el archivo

    return uploadImage;
  },
  // upload_files:(path_to_save, inputs_name)=> {
  //     const storage = multer.diskStorage({
  //         destination: function (req, file, cb) {
  //             let extension = path.extname(file.originalname);
  //             if (isAllowedImage(extension))
  //                 cb(null, path_to_save + config.ARCHIVE_IMAGE_FOLDER);
  //             if (isAllowedFileBook(extension))
  //                 cb(null, path_to_save + config.ARCHIVE_FILE_FOLDER);
  //         }, //directorio donde se va guardar la imagen
  //         filename: function (req, file, cb) {
  //             //Configuracion para poner nombre a la imagen

  //             crypto.pseudoRandomBytes(16, function (err, raw) {
  //                 cb(
  //                     null,
  //                     raw.toString("hex") + Date.now() + path.extname(file.originalname)
  //                 ); //encriptacion+fechaActual+.extencion
  //             });
  //         },
  //     });

  //     const uploadArchiveAndImage = multer({
  //         storage,
  //         limits: 10000,
  //         fileFilter: function (req, file, cb) {
  //             let extension = path.extname(file.originalname).toLowerCase();

  //             switch (file.fieldname) {
  //                 case inputs_name.image: {
  //                     return isAllowedImage(extension) ? cb(null, true) : cb(null, false);
  //                 }
  //                 case inputs_name.file: {
  //                     if (isAllowedFileBook(extension)) {
  //                         req.register = true;
  //                         return cb(null, true);
  //                     } else {
  //                         req.register = false;
  //                         return cb(null, false);
  //                     }
  //                 }
  //                 default: {
  //                     req.register = false;
  //                     return cb(null, false);
  //                 }
  //             }
  //         },
  //     }).fields([
  //         { name: inputs_name.file, maxCount: 1 },
  //         { name: inputs_name.image, maxCount: 1 },
  //     ]); //nombre el input que trae el archivo

  //     return uploadArchiveAndImage;
  // }
};
