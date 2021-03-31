const isUndefinedOrNull = require("validate.io-undefined-or-null/lib");
module.exports = {
  areFieldsValid: (fields = []) => {
    return !fields.some((field) => isUndefinedOrNull(field));
  },
};
