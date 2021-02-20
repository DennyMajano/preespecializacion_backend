const security = require("../services/security/Token");


function isFreeToSee(path){
  const nonSecurePaths =[
    "login",
    "verify_token",
    "usuarios/request_new_password",
    "usuarios/change_password"
  ]

  for(let subpath of nonSecurePaths){
    if(path.startsWith(subpath)){
      return true;
    }
  }

  return false;

}

module.exports = (req, res, next) => {
  const path = req.originalUrl.replace("/api/", "");
  if (!isFreeToSee(path)) {
    if (!req.headers.authorization) {
      return res.status(403).send({ message: "No tienes autorización" });
    }
  }
  const token = req.headers.authorization
    ? req.headers.authorization.split(" ")[1]
    : null;
  const decoded = security.decodeToken(token);

  if (!isFreeToSee(path)) {
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
