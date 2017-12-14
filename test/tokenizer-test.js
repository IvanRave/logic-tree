const chai = require('chai');
const Tokenizer = require('../src/tokenizer');

const expect = chai.expect;

const tokenize = (sourceCode, params) =>
  new Tokenizer(sourceCode, params).run();

describe('Tokenizer', () => {

  it('Should tokenize only one identifier', () => {
    const sourceCode = 'a';
    const tokens = tokenize(sourceCode);

    expect(tokens).deep.equals([{
      name: 'T_IDENTIFIER',
      value: 'a',
      position: 0
    }]);
  });

  it('Should tokenize or expression', () => {
    const sourceCode = 'a or b';
    const tokens = tokenize(sourceCode);

    expect(tokens).deep.equals([
      {
        name: 'T_IDENTIFIER',
        value: 'a',
        position: 0
      },
      {
        name: 'T_SPACE',
        value: ' ',
        position: 1
      },
      {
        name: 'T_OR',
        value: 'or',
        position: 2
      },
      {
        name: 'T_SPACE',
        value: ' ',
        position: 4
      },
      {
        name: 'T_IDENTIFIER',
        value: 'b',
        position: 5
      }
    ]);
  });

  it('Should tokenize with ignore white spaces', () => {
    const sourceCode = ' a and b\t';
    const tokens = tokenize(sourceCode, {
      ignoreWhiteSpaces: true
    });

    expect(tokens).deep.equals([
      {
        name: 'T_IDENTIFIER',
        value: 'a',
        position: 1
      },
      {
        name: 'T_AND',
        value: 'and',
        position: 3
      },
      {
        name: 'T_IDENTIFIER',
        value: 'b',
        position: 7
      }
    ]);
  });

  it('Should tokenize correct or token when it last and first', () => {
    const sourceCode = 'or or or';
    const tokens = tokenize(sourceCode, {
      ignoreWhiteSpaces: true
    });

    expect(tokens).deep.equals([
      {
        name: 'T_OR',
        value: 'or',
        position: 0
      },
      {
        name: 'T_OR',
        value: 'or',
        position: 3
      },
      {
        name: 'T_OR',
        value: 'or',
        position: 6
      }
    ]);
  });

  it('Should tokenize open parenthesis', () => {
    const sourceCode = 'or(';
    const tokens = tokenize(sourceCode, {
      ignoreWhiteSpaces: true
    });

    expect(tokens).deep.equals([
      {
        name: 'T_OR',
        value: 'or',
        position: 0
      },
      {
        name: 'T_OPEN_PAREN',
        value: '(',
        position: 2
      }
    ]);
  });

  it('Should tokenize close parenthesis', () => {
    const sourceCode = ')))';
    const tokens = tokenize(sourceCode, {
      ignoreWhiteSpaces: true
    });

    expect(tokens).deep.equals([
      {
        name: 'T_CLOSE_PAREN',
        value: ')',
        position: 0
      },
      {
        name: 'T_CLOSE_PAREN',
        value: ')',
        position: 1
      },
      {
        name: 'T_CLOSE_PAREN',
        value: ')',
        position: 2
      }
    ]);
  });
});
