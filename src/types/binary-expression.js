class BinaryExpression {

  static type = 'BinaryExpression';

  constructor(token, params) {
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

module.exports = BinaryExpression;
