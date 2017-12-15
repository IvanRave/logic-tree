const tokens = require('./tokens');
const UnexpectedTokenException = require('./unexpected-token-exception');
const {checkItemsInRange} = require('./utils');

/**
 * TODO: Add static fields syntax
 * @type {string}
 */
const BinaryExpressionType = 'BinaryExpression';
class BinaryExpression {

  constructor(operator, params) {
    this.type = BinaryExpressionType;
    this.operator = operator;
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

const IdentifierType = 'Identifier';
class Identifier {

  constructor(name) {
    this.type = IdentifierType;
    this.name = name;
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
      return new Identifier(token.value);
    }
  }

  parseBinaryExpression(token) {
    if (!token) {
      return false;
    }

    const binaryOperatorsNames = [
      tokens.names.AND,
      tokens.names.OR
    ];

    const operandsNames = [
      IdentifierType
    ];

    if (checkItemsInRange(binaryOperatorsNames, [token.name])) {
      /**
       * TODO: научиться парсить не только идентификаторы
       * @type {boolean|*}
       */
      const nextToken = this.parseIdentifier(
        this.peek(1)
      );

      if (!checkItemsInRange(operandsNames, [this.contextTree.type, nextToken.type])) {
        return false;
      }

      this.next();

      return new BinaryExpression(token.name, {
        left: this.contextTree,
        right: nextToken
      });
    }
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
