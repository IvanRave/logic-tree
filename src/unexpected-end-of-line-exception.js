class UnexpectedEndOfLineException extends Error {

  constructor(expectedNames) {
    super();

    this.message = `Unexpected end of line. Expected: ${expectedNames.join(', ')}`;
  }
}

module.exports = UnexpectedEndOfLineException;
