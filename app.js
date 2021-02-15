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
const app = express();
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
//import autentication middleware
const authentication = require("./middlewares/Autentication");

//configuracion de cors
const corsOption = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 200,
};
//configuracion
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "recursos")));
app.use(cors(corsOption));

// Swagger definition
const swaggerDefinition = {
  info: {
    title: process.env.SWAGGER_TITLE, // Title of the documentation
    version: process.env.SWAGGER_VERSION_API, // Version of the app
    description: process.env.SWAGGER_DESCRIPTION, // short description of the app
  },
  host: process.env.SWAGGER_HOST, // the host or url of the app
  basePath: process.env.SWAGGER_BASE_URL, // the basepath of your endpoint
};
// options for the swagger docs
const options = {
  // import swaggerDefinitions
  swaggerDefinition,
  // path to the API docs
  apis: ["./docs/**/*.yaml"],
};
const swaggerOpt = {
  swaggerOptions: {
    defaultModelsExpandDepth: -1,
  },
};

// initialize swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options);

// use swagger-Ui-express for your app documentation endpoint
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerOpt));

//configuracion de autenticacion
//Descomentar esto para utilizar tokens
if (process.env.MODE === "production") {
  app.use(authentication);
}
//Import Router
require("./routes/index")(app);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send(`Error: ${err}`);
});

module.exports = app;
