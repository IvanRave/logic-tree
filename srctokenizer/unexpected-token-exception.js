class UnexpectedTokenException extends Error {

  constructor(token) {
    super();
    this.message = `Unexpected token at column: ${token.position}`;
  }
}

module.exports = UnexpectedTokenException;
