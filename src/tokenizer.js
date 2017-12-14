const head = require('ramda/src/head');

const tokenNames = {
  IDENTIFIER: 'T_IDENTIFIER',
  OR: 'T_OR',
  AND: 'T_AND',
  SPACE: 'T_SPACE'
};

const tokens = [
  {
    name: tokenNames.SPACE,
    pattern: /^\s+/
  },
  {
    name: tokenNames.OR,
    pattern: /^or(?=\s|)/i
  },
  {
    name: tokenNames.AND,
    pattern: /^and(?=\s|)/i
  },
  {
    name: tokenNames.IDENTIFIER,
    pattern: /^([a-zA-Z_])+\w*/
  }
];

class Tokenizer {

  /**
   * @param text {string} - source code
   * @param config {Object?}
   * @param config.ignoreWhiteSpaces {boolean}
   */
  constructor(text, config = {}) {
    this.text = text;
    this.position = 0;
    this.tokens = [];
    this.config = config;
  }

  shouldIgnoreWhiteSpace(token) {
    const isWhiteSpace = token.name === tokenNames.SPACE;
    return this.config.ignoreWhiteSpaces && isWhiteSpace;
  }

  run() {
    while (this.position !== this.text.length) {
      for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        const pattern = token.pattern;
        const text = this.text.slice(this.position);
        const match = text.match(pattern);

        if (!match) {
          continue;
        }

        const value = head(match);

        if (!this.shouldIgnoreWhiteSpace(token)) {
          this.tokens.push({
            name: token.name,
            value,
            position: this.position
          });
        }

        this.position += value.length;
      }
    }

    return this.tokens;
  }
}

module.exports = Tokenizer;
