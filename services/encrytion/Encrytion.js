const CryptoJS = require("crypto-js");
var key = process.env.KEY_ENCRYPTION;
module.exports = {
  encrypt: function encrypt(data) {
    data = CryptoJS.AES.encrypt(data, key);

    return data
      .toString()
      .split("/")
      .join("Por21Ld")
      .split("=")
      .join("Ml32")
      .split("+")
      .join("xMl3Jk");
  },
  //funcion para desencriptar la sesion
  decrypt: function decrypt(data) {
    data = CryptoJS.AES.decrypt(
      data
        .toString()
        .split("Por21Ld")
        .join("/")
        .split("Ml32")
        .join("=")
        .split("xMl3Jk")
        .join("+"),
      key
    );

    data = data.toString(CryptoJS.enc.Utf8);

    return data;
  },

  encrypt_id: text => {
    try {
      var b64 = CryptoJS.AES.encrypt(String(text), key).toString();
      var e64 = CryptoJS.enc.Base64.parse(b64);
      var eHex = e64.toString(CryptoJS.enc.Hex);
      return eHex;
    } catch (error) {
      return error;
    }
  },

  decrypt_id: text => {
    try {
      var reb64 = CryptoJS.enc.Hex.parse(String(text));
      var bytes = reb64.toString(CryptoJS.enc.Base64);
      var decrypt = CryptoJS.AES.decrypt(bytes, key);
      var plain = decrypt.toString(CryptoJS.enc.Utf8);
      return plain;
    } catch (error) {
      return error;
    }
  }
};
