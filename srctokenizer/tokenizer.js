const head = require('ramda/src/head');
const tokens = require('./tokens');

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
    const isWhiteSpace = token.name === tokens.names.SPACE;
    return this.config?.ignoreWhiteSpaces && isWhiteSpace;
  }

  /**
   * Start lexer
   * @returns {Array<{
   *    name: string,
   *    value: string,
   *    position: string
   * }>}
   */
  run() {
    while (this.position !== this.text.length) {
      for (let i = 0; i < tokens.list.length; i++) {
        const token = tokens.list[i];
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
