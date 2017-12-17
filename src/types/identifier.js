class Identifier {

  static type = 'Identifier';

  constructor(token) {
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

module.exports = Identifier;
