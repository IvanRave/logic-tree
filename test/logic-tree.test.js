const BracketTree = require('./../src/bracket-tree');
const LogicTree = require('./../src/logic-tree');
const chai = require('chai');

const expect = chai.expect;

const build = (expr) => {
  const bracketTree = new BracketTree(expr);
  return new LogicTree(bracketTree.nodes, bracketTree.text).getAst();
};

describe('logic-tree', () => {
  it('one condition', () => {
    const expr = 'condition';

    expect(build(expr)).deep.equal({
      name: 'condition'
    });
  });

  it('one negative condition', () => {
    const expr = '!condition';

    expect(build(expr)).deep.equal({
      isNegation: true,
      name: 'condition'
    });
  });

  it('one bracket negative condition', () => {
    const expr = '!(condition1 AND condition2)';

    expect(build(expr)).deep.equal({
      isNegation: true,
      name: 'node0',
      content: 'condition1 AND condition2',
      orParams: [{
        text: 'condition1 AND condition2',
        andParams: [{
          name: 'condition1'
        }, {
          name: 'condition2'
        }]
      }]
    });
  });

  it('a AND b OR c', () => {
    const expr = 'a AND b OR c';

    expect(build(expr)).deep.equal({
      name: 'node0',
      content: 'a AND b OR c',
      orParams: [{
        text: 'a AND b',
        andParams: [{ name: 'a' }, { name: 'b' }]
      }, {
        text: 'c',
        andParams: [{ name: 'c' }]
      }]
    });
  });

  it('a AND b OR c', () => {
    const expr = 'a OR b AND !(c OR d AND (f OR !e)) OR g';

    expect(build(expr)).deep.equal({
      name: 'node0',
      content: 'a OR b AND !node0 OR g',
      orParams: [{
        text: 'a',
        andParams: [{ name: 'a' }]
      }, {
        text: 'b AND !node0',
        andParams: [{
          name: 'b'
        }, {
          isNegation: true,
          name: 'node0',
          content: 'c OR d AND node0',
          orParams: [{
            text: 'c', andParams: [{ name: 'c' }]
          }, {
            text: 'd AND node0',
            andParams: [{
              name: 'd'
            }, {
              name: 'node0',
              content: 'f OR !e',
              orParams: [{
                text: 'f', andParams: [{ name: 'f' }]
              }, {
                text: '!e',
                andParams: [{
                  isNegation: true,
                  name: 'e'
                }]
              }]
            }]
          }]
        }]
      }, {
        text: 'g', andParams: [{ name: 'g' }]
      }]
    });
  });
});
