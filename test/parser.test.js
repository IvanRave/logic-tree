const chai = require('chai');
const Parser = require('../src/parser');
const UnexpectedTokenException = require('../src/unexpected-token-exception');

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
    },
    unexpected: {
      name: 'T_UNEXPECTED',
      value: '',
      position: 5
    }
  };

  it('should build identifier', () => {
    const parser = new Parser([
      tokens.identifier
    ]);

    const ast = parser.parse();

    expect(ast).deep.equals({
      type: 'Identifier',
      name: 'a'
    });
  });

  it('should build binary expression', () => {
    const parser = new Parser([
      tokens.identifier,
      tokens.or,
      tokens.identifier
    ]);

    const ast = parser.parse();

    expect(ast).deep.equals({
      type: 'BinaryExpression',
      operator: 'T_OR',
      left: {
        type: 'Identifier',
        name: 'a'
      },
      right: {
        type: 'Identifier',
        name: 'a'
      }
    });
  });

  it('should throw Unexpected token exception', () => {
    const parser = new Parser([
      tokens.unexpected
    ]);

    const willException = () => parser.parse();

    expect(willException).throw(UnexpectedTokenException);
  });

  it('should not parse binary expression when token lacks', () => {
    const parser = new Parser([
      tokens.identifier,
      tokens.or
    ]);

    const willException = () => parser.parse();

    expect(willException).throw(UnexpectedTokenException);
  });

  xit('should not parse binary expression when token is incorrect', () => {
    const parser = new Parser([
      tokens.identifier,
      tokens.or,
      tokens.or
    ]);

    const willException = () => parser.parse();

    expect(willException).throw(UnexpectedTokenException);
  });
});
