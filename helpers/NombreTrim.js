module.exports = (text) => {
  return text !== null
    ? text.replace("   ", " ").trim().replace("  ", " ")
    : null;
};
