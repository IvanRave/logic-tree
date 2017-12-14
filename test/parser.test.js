const chai = require('chai');
const Parser = require('../src/parser');

const expect = chai.expect;

describe('AST Builder test', () => {

  const tokens = {
    identifier: {
      name: 'T_IDENTIFIER',
      value: 'a',
      position: 1
    },
    or: {
      name: 'T_OR',
      value: 'and',
      position: 3
    }
  };

  it('', () => {
    const parser = new Parser([
      tokens.identifier
    ]);

    const ast = parser.parse();

    expect(ast).deep.equals({
      type: 'Identifier',
      name: 'a'
    });
  });

  it('shoult build binary expression', () => {
    const parser = new Parser([
      tokens.identifier,
      tokens.or,
      tokens.identifier
    ]);

    const ast = parser.parse();

    expect(ast).deep.equals({
      binaryExpression: {
        type: 'T_OR',
        left: {
          type: 'Identifier',
          name: 'a'
        },
        right: {
          type: 'Identifier',
          name: 'a'
        }
      }
    });
  });
});
