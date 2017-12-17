const prop = require('ramda/src/prop');
const equals = require('ramda/src/equals');

const getType = prop('type');
const getName = prop('name');

const checkTokenName = (token, name) =>
  equals(getName(token), name);

const isTokenInRange = (range, token) =>
  range.some((name) => checkTokenName(token, name));

const isNodeInRange = (nodes, node) =>
  nodes.some((n) => equals(getType(n), getType(node)));

module.exports = {
  isNodeInRange,
  isTokenInRange
};
