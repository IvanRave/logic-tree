const names = {
  IDENTIFIER: 'T_IDENTIFIER',
  OR: 'T_OR',
  AND: 'T_AND',
  SPACE: 'T_SPACE',
  OPEN_PAREN: 'T_OPEN_PAREN',
  CLOSE_PAREN: 'T_CLOSE_PAREN',
};

const list = [
  {
    name: names.SPACE,
    pattern: /^\s+/
  },
  {
    name: names.OR,
    pattern: /^or(?=\s|)/i
  },
  {
    name: names.AND,
    pattern: /^and(?=\s|)/i
  },
  {
    name: names.OPEN_PAREN,
    pattern: /^\(/
  },
  {
    name: names.CLOSE_PAREN,
    pattern: /^\)/
  },
  {
    name: names.IDENTIFIER,
    pattern: /^([a-zA-Z_])+\w*/
  }
];

module.exports.names = names;
module.exports.list = list;
