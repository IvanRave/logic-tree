const tokens = require('./tokens');
const UnexpectedTokenException = require('./unexpected-token-exception');

class BinaryExpression {

  constructor(type, params) {
    this.type = type;
    this.left = params.left;
    this.right = params.right;
  }

  getAst() {
    return {
      binaryExpression: {
        type: this.type,
        left: this.left.getAst(),
        right: this.right.getAst()
      }
    };
  }
}

class Identifier {

  constructor(name) {
    this.name = name;
  }

  getAst() {
    return {
      type: 'Identifier',
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
    if (token.name === tokens.names.IDENTIFIER) {
      return new Identifier(token.value);
    }
  }

  parseBinaryExpression(token) {
    /**
     * TODO: отвязаться от указания конкретных BinaryExpression, придумать как обобщить
     */
    if ([tokens.names.AND, tokens.names.OR].includes(token.name)) {
      /**
       * TODO: тут может быть не идентификатор, придумать как проверять совместимость с BinaryExpression
       */
      const nextToken = this.parseIdentifier(this.next());
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
        const parsed = parser(token);
        if (parsed) {
          this.contextTree = parsed;
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
