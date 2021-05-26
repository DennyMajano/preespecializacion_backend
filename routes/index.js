const testRoutes = require("./TestRoutes/TestRoutes")();
const modulosRouter = require("./Modulos/Modulos.router")();
const rolesRouter = require("./Roles/Roles.router")();
const generalesRouter = require("./Generales/Generales.router")();
const accesoRouter = require("./Acceso/Acceso.router")();
const usuariosRouter = require("./Usuarios/Usuarios.router")();
const tipoDocumentoRouter = require("./TipoDocumento/TipoDocumento.router")();
const personasRouter = require("./Personas/Personas.router")();
const zonasRouter = require("./Zonas/Zonas.router")();
const distritosRouter = require("./Distritos/Distritos.router")();
const iglesiasRouter = require("./Iglesias/Iglesia.router")();
const pastoresRouter = require("./Pastores/Pastores.router")();
const maestroInformeRouter = require("./MaestroInforme/MaestroInforme.router")();
const nivelPastorRouter = require("./NivelPastor/NivelPastor.router")();
const nivelesAcademicosRouter = require("./NivelesAcademicos/NivelesAcademicos.router")();
const periodosMinisterialesRouter = require("./PeriodosMinisteriales/PeriodosMinisteriales.router")();
const gestionesRouter = require("./Gestiones/Gestiones.router")();

//Informes
const informesRouter = require("./Informes/Informes.router")();
const informeMinisterialMensualRouter = require("./Informes/InformeMinisterialMensual.router")();
const informeTesoreroMensualRouter = require("./Informes/InformeTesoreroMensual.router")();
const informeFinancieroMensualRouter = require("./Informes/InformeFinancieroMensual.router")();
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
  app.use("/api", iglesiasRouter);
  app.use("/api", pastoresRouter)
  app.use("/api", maestroInformeRouter);
  app.use("/api", nivelPastorRouter);
  app.use("/api", nivelesAcademicosRouter);
  app.use("/api", periodosMinisterialesRouter);
  app.use("/api", gestionesRouter);
  app.use("/api", informesRouter);
  app.use("/api", informeMinisterialMensualRouter);
  app.use("/api", informeTesoreroMensualRouter);
  app.use("/api", informeFinancieroMensualRouter);

  //Rutas de prueba
  app.use("/api", testRoutes);
  //other routes..
};
