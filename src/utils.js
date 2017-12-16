const checkTokenName = (token, name) =>
  token && token.name === name;

const isTokenInRange = (range, token) =>
  range.some((name) => checkTokenName(token, name));

module.exports = {
  checkTokenName,
  isTokenInRange
};
