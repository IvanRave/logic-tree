import BracketTree from './bracket-tree';
import { IBracketNode } from './types';

type IExample = {
  name: string,
  input: string,
  want: IBracketNode,
}

const examples: Array<IExample> = [{
  name: 'should handle brackets',
  input: 'a OR (b OR c) AND (e OR f)',
  want: {
    relText: 'node0',
    nodes: [{
      relText: 'a OR node0 AND node1',
      nodes: [{
        relText: 'b OR c',
        nodes: []
      }, {
        relText: 'e OR f',
        nodes: []
      }]
    }]
  }
}, {
  name: 'should parse simple negation',
  input: '!(a AND b)',
  want: {
    relText: '!node0',
    nodes: [{
      relText: 'a AND b',
      nodes: []
    }]
  }
}, {
  name: 'should leave double negation as is',
  input: '!!a',
  want: {
    relText: '!!a',
    nodes: []
  }
}, {
  name: 'should provide long expression example',
  input: '!(a OR b OR C AND (D OR F) OR (G OR (K OR L) OR C) AND (B OR C))',
  want: {
    relText: '!node0',
    nodes: [{
      relText: 'a OR b OR C AND node0 OR node1 AND node2',
      nodes: [{
        relText: 'D OR F',
        nodes: []
      }, {
        relText: 'G OR node0 OR C',
        nodes: [{
          relText: 'K OR L',
          nodes: []
        }]
      }, {
        relText: 'B OR C',
        nodes: []
      }]
    }]
  }
}]

describe('bracket tree', () => {
  examples.forEach(ex => {
    test(ex.name, () => {
      const got = new BracketTree()
      got.applyExpression(ex.input)
      expect(got.root).toEqual(ex.want)
    })
  })
});
