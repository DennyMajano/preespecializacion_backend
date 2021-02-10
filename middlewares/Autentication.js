const security = require("../services/security/Token");

module.exports = (req, res, next) => {
  const path = req.originalUrl.replace("/api/", "");
  if (path != "login") {
    if (!req.headers.authorization) {
      return res.status(403).send({ message: "No tienes autorización" });
    }
  }
  const token = req.headers.authorization
    ? req.headers.authorization.split(" ")[1]
    : null;
  const decoded = security.decodeToken(token);

  if (path != "login") {
    if (decoded != 0) {
      next();
    } else {
      res.status(403).send({ message: `No tienes autorizacion` });
    }
  } else {
    next();
  }
};
