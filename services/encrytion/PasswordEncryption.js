const bcrypt = require("bcrypt");
const salt = bcrypt.genSaltSync(10);

module.exports = {
  /**
   *
   *
   * @param {string} text_password
   * @returns contraseña encriptada
   *  @description Esta funcion es para encriptar la contraseña
   */
  encrypt_password: (text_password) => {
    const hash = bcrypt.hashSync(text_password, salt);

    return hash;
  },
  /**
   *
   *
   * @param {string} text_password
   * @param {string} hash
   * @returns true si la contraseña es válida false si es incorrecta
   */
  validation_password: (text_password, hash) => {
    const compare = bcrypt.compareSync(text_password, hash);
    return compare;
  },
};
