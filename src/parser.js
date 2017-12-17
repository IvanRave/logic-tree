const isNil = require('ramda/src/isNil');
const tokens = require('./tokens');
const BinaryExpression = require('./types/binary-expression');
const UnaryExpression = require('./types/unary-expression');
const Identifier = require('./types/identifier');
const UnexpectedTokenException = require('./unexpected-token-exception');
const UnexpectedEndOfLineException = require('./unexpected-end-of-line-exception');
const {isTokenInRange, isNodeInRange} = require('./utils');

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
    if (token.name === tokens.names.IDENTIFIER) {
      return new Identifier(token);
    }
  }

  parseBinaryExpression(token) {
    const binaryOperatorNames = [
      tokens.names.AND,
      tokens.names.OR
    ];

    const nextTokenNames = [
      tokens.names.IDENTIFIER,
      tokens.names.OPEN_PAREN
    ];

    const prevNodes = [
      Identifier.type,
      BinaryExpression.type
    ];

    const nextToken = this.peek(1);

    if (!isTokenInRange(binaryOperatorNames, token)
      || !isTokenInRange(nextTokenNames, nextToken)
      || !isNodeInRange(prevNodes, this.contextTree.type)) {
      return null;
    }

    this.next();

    return new BinaryExpression(token, {
      left: this.contextTree,
      right: this.parseByToken(nextToken)
    });
  }

  parseParentheses(token) {
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
  }

  parseUnaryExpression(token) {
    /**
     * TODO: think how to describe grammar with state machine
     */
    const unaryOperatorNames = [
      tokens.names.NOT
    ];

    if (!isTokenInRange(unaryOperatorNames, token)) {
      return null;
    }

    const nextTokenNames = [
      tokens.names.NOT,
      tokens.names.IDENTIFIER,
      tokens.names.OPEN_PAREN
    ];

    const nextTokenForCheck = this.peek(1);

    if (!isTokenInRange(nextTokenNames, nextTokenForCheck)) {
      return null;
    }

    const nextToken = this.next();
    const nextExpression = this.parseByToken(nextToken);

    return new UnaryExpression(token, nextExpression);
  }

  parse() {
    while (this.tokens.length !== this.current) {
      const token = this.peek();

      this.contextTree = this.parseByToken(token);

      this.next();
    }

    return this.contextTree.parse();
  }

  parseByToken(token) {
    const parsers = [
      this.parseIdentifier.bind(this),
      this.parseBinaryExpression.bind(this),
      this.parseParentheses.bind(this),
      this.parseUnaryExpression.bind(this)
    ];

    let parseByTokenResult = null;

    const parsed = parsers.some((parser) => {
      const parseResult = token ? parser(token) : null;

      if (!isNil(parseResult)) {
        parseByTokenResult = parseResult;
        return true;
      }
    });

    if (parsed) {
      return parseByTokenResult;
    }

    throw new UnexpectedTokenException(token);
  }
}

module.exports = Parser;
