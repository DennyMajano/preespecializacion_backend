const modulosRouter = require("./Modulos/Modulos.router")();
const rolesRouter = require("./Roles/Roles.router")();
const generalesRouter = require("./Generales/Generales.router")();
const accesoRouter = require("./Acceso/Acceso.router")();
const usuariosRouter = require("./Usuarios/Usuarios.router")();
const tipoDocumentoRouter = require("./TipoDocumento/TipoDocumento.router")();

module.exports = function (app) {
  //rutas configuracion
  app.use("/api", modulosRouter);
  app.use("/api", rolesRouter);
  app.use("/api", generalesRouter);
  app.use("/api", accesoRouter);
  app.use("/api", usuariosRouter);
  app.use("/api", tipoDocumentoRouter);
  //other routes..
};
