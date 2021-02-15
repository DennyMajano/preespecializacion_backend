const security = require("../services/security/Token");


function isFreeToSee(path){
  path2= path.split("/");
  return path2[0]=="verificar_token_pass" && path2.length == 2;
}

module.exports = (req, res, next) => {
  const path = req.originalUrl.replace("/api/", "");
  if (path != "login" && !isFreeToSee(path)) {
    if (!req.headers.authorization) {
      return res.status(403).send({ message: "No tienes autorización" });
    }
  }
  const token = req.headers.authorization
    ? req.headers.authorization.split(" ")[1]
    : null;
  const decoded = security.decodeToken(token);

  if (path != "login" && !isFreeToSee(path)) {
    console.log("2");
    if (decoded != 0) {
      next();
    } else {
      res.status(403).send({ message: `No tienes autorizacion` });
    }
  } else {
    next();
  }
};
