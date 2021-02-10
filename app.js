const createError = require("http-errors");
//Para las variables de entorno
const dotenv = require("dotenv");
//Para la configuracion del .env
dotenv.config();
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const database = require("./config/database.async");
const app = express();
//import autentication middleware
const authentication = require("./middlewares/Autentication");

//configuracion de cors
const corsOption = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 200
};
//configuracion
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "recursos")));
app.use(cors(corsOption));
//configuracion de autenticacion
//Descomentar esto para utilizar tokens
if (process.env.MODE === "production") {
  app.use(authentication);
}
//Import Router
require("./routes/index")(app);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send(`Error: ${err}`);
});

module.exports = app;
