const BracketTree = require('./bracket-tree');
const LogicTree = require('./logic-tree');

const build = (expr) => {
  const bracketTree = new BracketTree(expr);
  return new LogicTree(bracketTree.nodes, bracketTree.text);
};

describe('logic-tree', () => {
  it('one condition', () => {
    const expr = 'condition';

    expect(build(expr)).toEqual({
      paramName: 'condition'
    });
  });

  it('one negative condition', () => {
    const expr = '!condition';

    expect(build(expr)).toEqual({
      isNegation: true,
      paramName: 'condition'
    });
  });

  it('one bracket negative condition', () => {
    const expr = '!(condition1 AND condition2)';

    expect(build(expr)).toEqual({
      isNegation: true,
      paramName: 'node0',
      paramContent: 'condition1 AND condition2',
      orParams: [{
        text: 'condition1 AND condition2',
        andParams: [{
          paramName: 'condition1'
        }, {
          paramName: 'condition2'
        }]
      }]
    });
  });

  it('a AND b OR c', () => {
    const expr = 'a AND b OR c';

    expect(build(expr)).toEqual({
      paramName: 'node0',
      paramContent: 'a AND b OR c',
      orParams: [{
        text: 'a AND b',
        andParams: [{ paramName: 'a' }, { paramName: 'b' }]
      }, {
        text: 'c',
        andParams: [{ paramName: 'c' }]
      }]
    });
  });

  it('a AND b OR c', () => {
    const expr = 'a OR b AND !(c OR d AND (f OR !e)) OR g';

    expect(build(expr)).toEqual({
      paramName: 'node0',
      paramContent: 'a OR b AND !node0 OR g',
      orParams: [{
        text: 'a',
        andParams: [{ paramName: 'a' }]
      }, {
        text: 'b AND !node0',
        andParams: [{
          paramName: 'b'
        }, {
          isNegation: true,
          paramName: 'node0',
          paramContent: 'c OR d AND node0',
          orParams: [{
            text: 'c', andParams: [{ paramName: 'c' }]
          }, {
            text: 'd AND node0',
            andParams: [{
              paramName: 'd'
            }, {
              paramName: 'node0',
              paramContent: 'f OR !e',
              orParams: [{
                text: 'f', andParams: [{ paramName: 'f' }]
              }, {
                text: '!e',
                andParams: [{
                  isNegation: true,
                  paramName: 'e'
                }]
              }]
            }]
          }]
        }]
      }, {
        text: 'g', andParams: [{ paramName: 'g' }]
      }]
    });
  });
});
