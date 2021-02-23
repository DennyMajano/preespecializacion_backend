const modulosRouter = require("./Modulos/Modulos.router")();
const rolesRouter = require("./Roles/Roles.router")();
const generalesRouter = require("./Generales/Generales.router")();
const accesoRouter = require("./Acceso/Acceso.router")();
const usuariosRouter = require("./Usuarios/Usuarios.router")();
const tipoDocumentoRouter = require("./TipoDocumento/TipoDocumento.router")();
const personasRouter = require("./Personas/Personas.router")();
const zonasRouter = require("./Zonas/Zonas.router")();
const distritosRouter = require("./Distritos/Distritos.router")();

module.exports = function (app) {
  //rutas configuracion
  app.use("/api", modulosRouter);
  app.use("/api", rolesRouter);
  app.use("/api", generalesRouter);
  app.use("/api", accesoRouter);
  app.use("/api", usuariosRouter);
  app.use("/api", tipoDocumentoRouter);
  app.use("/api", personasRouter);
  app.use("/api", zonasRouter);
  app.use("/api", distritosRouter);
  //other routes..
};
