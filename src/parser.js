const tokens = require('./tokens');
const UnexpectedTokenException = require('./unexpected-token-exception');
const {isTokenInRange} = require('./utils');

class BinaryExpression {

  static type = 'BinaryExpression';

  constructor(token, params) {
    this.token = token;
    this.type = BinaryExpression.type;
    this.operator = token.value;
    this.left = params.left;
    this.right = params.right;
  }

  getAst() {
    return {
      type: this.type,
      operator: this.operator,
      left: this.left.getAst(),
      right: this.right.getAst()
    };
  }
}

class Identifier {

  static type = 'Identifier';

  constructor(token) {
    this.token = token;
    this.type = Identifier.type;
    this.name = token.value;
  }

  getAst() {
    return {
      type: this.type,
      name: this.name
    };
  }
}

class Parser {

  constructor(tokens) {
    this.tokens = tokens;
    this.current = 0;

    this.contextTree = null;
  }

  peek(offset = 0) {
    return this.tokens[this.current + offset];
  }

  next() {
    this.current++;
    return this.peek();
  }

  parseIdentifier(token) {
    if (!token) {
      return false;
    }

    if (token.name === tokens.names.IDENTIFIER) {
      return new Identifier(token);
    }
  }

  parseBinaryExpression(token) {
    if (!token) {
      return false;
    }

    const binaryOperatorNames = [
      tokens.names.AND,
      tokens.names.OR
    ];

    const operandNames = [
      tokens.names.IDENTIFIER
    ];

    const nextToken = this.peek(1);

    if (!isTokenInRange(binaryOperatorNames, token)
      || !isTokenInRange(operandNames, nextToken)
      || !isTokenInRange(operandNames, this.contextTree.token)) {
      return false;
    }

    this.next();

    return new BinaryExpression(token, {
      left: this.contextTree,
      right: this.parseIdentifier(nextToken)
    });
  }

  parse() {
    while (this.tokens.length !== this.current) {
      const token = this.peek();

      const parsers = [
        this.parseIdentifier.bind(this),
        this.parseBinaryExpression.bind(this)
      ];

      const parsed = parsers.some((parser) => {
        const parseResult = parser(token);

        if (parseResult) {
          this.contextTree = parseResult;
          return true;
        }
      });

      if (!parsed) {
        throw new UnexpectedTokenException(token);
      }

      this.next();
    }

    return this.contextTree.getAst();
  }
}

module.exports = Parser;
