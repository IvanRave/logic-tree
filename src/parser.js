const tokens = require('./tokens');

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
    if ([tokens.names.AND, tokens.names.OR].includes(token.name)) {
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

      parsers.some((parser) => {
        const parsed = parser(token);
        if (parsed) {
          this.contextTree = parsed;
          return true;
        }
      });

      this.next();
    }

    return this.contextTree.getAst();
  }
}

module.exports = Parser;
