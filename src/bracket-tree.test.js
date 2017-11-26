const BracketTree = require('./bracket-tree');

describe('tree', () => {
  it('long expr', () => {
    const expr = '!(a OR b OR C AND (D OR F) OR (G OR (K OR L) OR C) AND (B OR C))';

    const received = new BracketTree(expr);

    const expected = {
      text: '!node0',
      nodes: [{
        text: 'a OR b OR C AND node0 OR node1 AND node2',
        nodes: [{
          text: 'D OR F',
          nodes: []
        }, {
          text: 'G OR node0 OR C',
          nodes: [{
            text: 'K OR L',
            nodes: []
          }]
        }, {
          text: 'B OR C',
          nodes: []
        }]
      }]
    };

    expect(received).toEqual(expected);
  });

  it('no-brackets', () => {
    const expr = 'a OR (b OR c) AND (e OR f)';

    const received = new BracketTree(expr);
    const expected = {
      text: 'node0',
      nodes: [{
        text: 'a OR node0 AND node1',
        nodes: [{
          text: 'b OR c',
          nodes: []
        }, {
          text: 'e OR f',
          nodes: []
        }]
      }]
    };

    expect(expected).toEqual(received);
  });
});
