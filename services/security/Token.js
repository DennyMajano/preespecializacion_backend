const moment = require("moment");
const jwt = require("jwt-simple");
const key = process.env.KEY_TOKEN;
const encryption = require("../encrytion/Encrytion");
module.exports = {
  createToken: (data) => {
    const payload = {
      usuario: data.usuario,
      username: data.username,
      rol: data.rol,
      codempleado: data.empleado,
      modulos: data.modulos,
      iat: moment().unix(),
      exp: moment().add(24, "hour").unix(),
    };

    let token = jwt.encode(payload, key, "HS512");
    return token;
  },
  decodeToken: (token) => {
    let payload;
    let token_decode = encryption.decrypt(String(token));
    try {
      payload = jwt.decode(token_decode, key, false, "HS512");
      if (payload.exp <= moment().unix()) {
        payload = 0;
      }
    } catch (error) {
      return 0;
    }

    return payload;
  },
};
