const tokens = require('./tokens');
const UnexpectedTokenException = require('./unexpected-token-exception');
const UnexpectedEndOfLineException = require('./unexpected-end-of-line-exception');
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

  parse() {
    return {
      type: this.type,
      operator: this.operator,
      left: this.left.parse(),
      right: this.right.parse()
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

  parse() {
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

  /**
   * TODO: take off parsers
   */
  parseIdentifier(token) {
    /**
     * TODO: Common precondition, inherit or check before parse
     */
    if (!token) {
      return false;
    }

    if (token.name === tokens.names.IDENTIFIER) {
      return new Identifier(token);
    }

    return false;
  }

  parseBinaryExpression(token) {
    if (!token) {
      return false;
    }

    const binaryOperatorNames = [
      tokens.names.AND,
      tokens.names.OR
    ];

    /**
     * TODO: check types. Can be token, or parsed node
     */
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

  parseParentheses(token) {

    if (!token) {
      return false;
    }

    const {
      OPEN_PAREN: openParenName,
      CLOSE_PAREN: closeParenName
    } = tokens.names;

    if (token.name === openParenName) {
      this.next();

      /**
       * TODO: think about Iterator
       */
      let currentPosition = this.current;
      let subTokens = [];
      while (currentPosition < this.tokens.length) {
        const token = this.peek(currentPosition - this.current);

        if (token.name === closeParenName) {
          if (subTokens.length === 0) {
            throw UnexpectedTokenException(token);
          }

          this.current = currentPosition;
          return new Parser(subTokens);
        }

        subTokens.push(token);
        currentPosition++;
      }

      throw new UnexpectedEndOfLineException([
        closeParenName
      ]);
    }

    return false;
  }

  parse() {
    while (this.tokens.length !== this.current) {
      const token = this.peek();

      const parsers = [
        this.parseIdentifier.bind(this),
        this.parseBinaryExpression.bind(this),
        this.parseParentheses.bind(this)
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

    return this.contextTree.parse();
  }
}

module.exports = Parser;
