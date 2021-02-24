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

  //nonSecurePaths.some((subpath => path.startsWith(subpath)));

  return false;

}

module.exports = (req, res, next) => {
  const path = req.originalUrl.replace("/api/", "");
  if (!isFreeToSee(path)) {
    if (!req.headers.authorization) {
      return res.status(403).send({ message: "No tienes autorización" });
    }
  }
  console.log("HEADERS");
  console.log(req.headers.authorization);
  const token = req.headers.authorization
    ? req.headers.authorization.split(" ")[1]
    : null;
  const decoded = security.decodeToken(token);

  if (!isFreeToSee(path)) {
   console.log("TOKEN DECODED") ;
    console.log(decoded);
    if (decoded != 0) {
      next();
    } else {
      res.status(403).send({ message: `No tienes autorización` });
    }
  } else {
    next();
  }
};
