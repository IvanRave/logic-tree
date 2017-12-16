const chai = require('chai');
const Parser = require('../src/parser');
const UnexpectedTokenException = require('../src/unexpected-token-exception');
const UnexpectedEndOfLineException = require('../src/unexpected-end-of-line-exception');

const expect = chai.expect;

describe('Parser', () => {

  const tokens = {
    identifier: {
      name: 'T_IDENTIFIER',
      value: 'a',
      position: 1
    },
    or: {
      name: 'T_OR',
      value: 'or',
      position: 2
    },
    openParen: {
      name: 'T_OPEN_PAREN',
      value: '(',
      position: 3,
    },
    closeParen: {
      name: 'T_CLOSE_PAREN',
      value: ')',
      position: 4,
    },
    unexpected: {
      name: 'T_UNEXPECTED',
      value: '',
      position: 0
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
      operator: 'or',
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

  it('should not parse binary expression when token is incorrect', () => {
    const parser = new Parser([
      tokens.identifier,
      tokens.or,
      tokens.or
    ]);

    const willException = () => parser.parse();

    expect(willException).throw(UnexpectedTokenException);
  });

  describe('parenthesis', () => {

    it('should throw UnexpectedEndOfLineException', () => {
      const parser = new Parser([
        tokens.openParen
      ]);

      const willException = () => parser.parse();

      expect(willException).throw(UnexpectedEndOfLineException);
    });

    it('should throw UnexpectedEndOfLineException when there are other tokens after an opening paren and closing one is absent', () => {
      const parser = new Parser([
        tokens.openParen,
        tokens.identifier,
        tokens.or,
        tokens.identifier
      ]);

      const willException = () => parser.parse();

      expect(willException).throw(UnexpectedEndOfLineException);
    });

    it('should correct parse opening and closing parenthesis', () => {
      const parser = new Parser([
        tokens.openParen,
        tokens.identifier,
        tokens.or,
        tokens.identifier,
        tokens.closeParen
      ]);

      const ast = parser.parse();

      expect(ast).deep.equals({
        type: 'BinaryExpression',
        operator: 'or',
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

    xit('should correct parse opening and closing parenthesis in the middle', () => {
      const parser = new Parser([
        tokens.identifier,
        tokens.or,
        tokens.identifier,
        tokens.or,
        tokens.identifier
      ]);

      const ast = parser.parse();

      console.log(ast);
    })
  });
});
