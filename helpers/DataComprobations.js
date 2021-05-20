const isUndefinedOrNull = require("validate.io-undefined-or-null/lib");
module.exports = {
  areFieldsValid: (fields = []) => {
    return !fields.some((field) => {
      console.log(field);
      return isUndefinedOrNull(field);
    });
  },
};
