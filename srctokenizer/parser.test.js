const Parser = require('./parser');
const UnexpectedTokenException = require('./unexpected-token-exception');
const UnexpectedEndOfLineException = require('./unexpected-end-of-line-exception');

describe('Parser', () => {

  const tokens = {
    identifier: (val = 'a') => ({
      name: 'T_IDENTIFIER',
      value: val,
      position: 1
    }),
    or: () => ({
      name: 'T_OR',
      value: 'or',
      position: 2
    }),
    and: () => ({
      name: 'T_AND',
      value: 'and',
      position: 2
    }),
    openParen: () => ({
      name: 'T_OPEN_PAREN',
      value: '(',
      position: 3
    }),
    closeParen: () => ({
      name: 'T_CLOSE_PAREN',
      value: ')',
      position: 4
    }),
    not: () => ({
      name: 'T_NOT',
      value: 'not',
      position: 5
    }),
    unexpected: () => ({
      name: 'T_UNEXPECTED',
      value: '',
      position: 0
    })
  };

  it('should build identifier', () => {
    const parser = new Parser([
      tokens.identifier()
    ]);

    const ast = parser.parse();

    expect(ast).toEqual({
      type: 'Identifier',
      name: 'a'
    });
  });

  it('should throw Unexpected token exception', () => {
    const parser = new Parser([
      tokens.unexpected()
    ]);

    const willException = () => parser.parse();

    expect(willException).toThrow(UnexpectedTokenException);
  });

  describe('BinaryExpression', () => {
    it('should build binary expression', () => {
      const parser = new Parser([
        tokens.identifier(),
        tokens.or(),
        tokens.identifier()
      ]);

      const ast = parser.parse();

      expect(ast).toEqual({
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

    it('should not parse binary expression when token lacks', () => {
      const parser = new Parser([
        tokens.identifier(),
        tokens.or()
      ]);

      const willException = () => parser.parse();

      expect(willException).toThrow(UnexpectedTokenException);
    });

    it('should not parse binary expression when token is incorrect', () => {
      const parser = new Parser([
        tokens.identifier,
        tokens.or(),
        tokens.or()
      ]);

      const willException = () => parser.parse();

      expect(willException).toThrow(UnexpectedTokenException);
    });

    it('should correct parse chain of BinaryExpression', () => {
      const parser = new Parser([
        tokens.identifier(),
        tokens.or(),
        tokens.identifier(),
        tokens.or(),
        tokens.identifier()
      ]);

      const originalAst = parser.parse();

      const expectedAst = {
        type: 'BinaryExpression',
        operator: 'or',
        left: {
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
        },
        right: {
          type: 'Identifier',
          name: 'a'
        }
      };

      expect(originalAst).toEqual(expectedAst);
    });
  });

  describe('parenthesis', () => {

    it('should throw UnexpectedEndOfLineException', () => {
      const parser = new Parser([
        tokens.openParen()
      ]);

      const willException = () => parser.parse();

      expect(willException).toThrow(UnexpectedEndOfLineException);
    });

    it('should throw UnexpectedEndOfLineException when there are other tokens after an opening paren and closing one is absent', () => {
      const parser = new Parser([
        tokens.openParen(),
        tokens.identifier(),
        tokens.or(),
        tokens.identifier()
      ]);

      const willException = () => parser.parse();

      expect(willException).toThrow(UnexpectedEndOfLineException);
    });

    it('should correct parse opening and closing parenthesis', () => {
      const parser = new Parser([
        tokens.openParen(),
        tokens.identifier(),
        tokens.or(),
        tokens.identifier(),
        tokens.closeParen()
      ]);

      const ast = parser.parse();

      expect(ast).toEqual({
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

    it('should parse with changed priority by parentheses', () => {
      const parser = new Parser([
        tokens.identifier(),
        tokens.or(),
        tokens.openParen(),
        tokens.identifier(),
        tokens.or(),
        tokens.identifier(),
        tokens.closeParen()
      ]);

      const originalAst = parser.parse();

      const expectedAst = {
        type: 'BinaryExpression',
        operator: 'or',
        left: {
          type: 'Identifier',
          name: 'a'
        },
        right: {
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
        }
      };

      expect(originalAst).toEqual(expectedAst);
    });

    describe('Binary Expression priorities', () => {

      it('should parse with reverse priorities flow', () => {
        const parser = new Parser([
          tokens.identifier('a'),
          tokens.or(),
          tokens.identifier('b'),
          tokens.and(),
          tokens.identifier('c')
        ]);

        const ast = parser.parse();

        expect(ast).toEqual({
          type: 'BinaryExpression',
          operator: 'or',
          left: {
            type: 'Identifier',
            name: 'a'
          },
          right: {
            type: 'BinaryExpression',
            operator: 'and',
            left: {
              type: 'Identifier',
              name: 'b'
            },
            right: {
              type: 'Identifier',
              name: 'c'
            }
          }
        });
      });

      it('should parse with normal flow', () => {
        const parser = new Parser([
          tokens.identifier('a'),
          tokens.and(),
          tokens.identifier('b'),
          tokens.or(),
          tokens.identifier('c')
        ]);

        const ast = parser.parse();

        expect(ast).toEqual({
          type: 'BinaryExpression',
          operator: 'or',
          left: {
            type: 'BinaryExpression',
            operator: 'and',
            left: {
              type: 'Identifier',
              name: 'a'
            },
            right: {
              type: 'Identifier',
              name: 'b'
            }
          },
          right: {
            type: 'Identifier',
            name: 'c'
          }
        });
      });
    });
  });

  describe('UnaryExpression', () => {
    it('should parse UnaryExpression with Identifier', () => {
      const parser = new Parser([
        tokens.not(),
        tokens.identifier()
      ]);

      const originalAst = parser.parse();

      const expectedAst = {
        type: 'UnaryExpression',
        name: 'not',
        value: {
          type: 'Identifier',
          name: 'a'
        }
      };

      expect(expectedAst).toEqual(originalAst);
    });

    it('should parse UnaryExpression chain', () => {
      const parser = new Parser([
        tokens.not(),
        tokens.not(),
        tokens.not(),
        tokens.identifier()
      ]);

      const originalAst = parser.parse();

      const expectedAst = {
        type: 'UnaryExpression',
        name: 'not',
        value: {
          type: 'UnaryExpression',
          name: 'not',
          value: {
            type: 'UnaryExpression',
            name: 'not',
            value: {
              type: 'Identifier',
              name: 'a'
            }
          }
        }
      };

      expect(expectedAst).toEqual(originalAst);
    });
  });
});
