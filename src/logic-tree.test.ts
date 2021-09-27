import BracketTree from './bracket-tree';
import LogicTree from './logic-tree';
import { IAndParam } from './types';

type IExample = {
  name: string,
  input: string,
  want: IAndParam
}

const build = (expr: string) => {
  const bracketTree = new BracketTree();
  bracketTree.applyExpression(expr)
  return new LogicTree(bracketTree.root)
};

const examples: Array<IExample> = [{
  name: 'primitive condition',
  input: 'condition',
  want: {
    name: 'condition'
  }
}, {
  name: 'negative condition',
  input: '!condition',
  want: {
    isNegation: true,
    name: 'condition'
  }
}, {
  // TODO: implement double/multiple negation if needed
  name: 'double negation',
  input: '!!condition',
  want: {
    isNegation: true,
    name: '!condition'
  }
}, {
  name: 'one bracket negative condition',
  input: '!(condition1 AND condition2)',
  want: {
    isNegation: true,
    name: 'node0',
    relText: 'condition1 AND condition2',
    orParams: [{
      relText: 'condition1 AND condition2',
      andParams: [{
        name: 'condition1'
      }, {
        name: 'condition2'
      }]
    }]
  }
}, {
  name: 'a AND b OR c',
  input: 'a AND b OR c',
  want: {
    name: 'node0',
    relText: 'a AND b OR c',
    orParams: [{
      relText: 'a AND b',
      andParams: [{ name: 'a' }, { name: 'b' }]
    }, {
      relText: 'c',
      andParams: [{ name: 'c' }]
    }]
  }
}, {
  name: 'a OR b AND !(c OR d AND (f OR !e)) OR g',
  input: 'a OR b AND !(c OR d AND (f OR !e)) OR g',
  want: {
    name: 'node0',
    relText: 'a OR b AND !node0 OR g',
    orParams: [{
      relText: 'a',
      andParams: [{ name: 'a' }]
    }, {
      relText: 'b AND !node0',
      andParams: [{
        name: 'b'
      }, {
        isNegation: true,
        name: 'node0',
        relText: 'c OR d AND node0',
        orParams: [{
          relText: 'c', andParams: [{ name: 'c' }]
        }, {
          relText: 'd AND node0',
          andParams: [{
            name: 'd'
          }, {
            name: 'node0',
            relText: 'f OR !e',
            orParams: [{
              relText: 'f', andParams: [{ name: 'f' }]
            }, {
              relText: '!e',
              andParams: [{
                isNegation: true,
                name: 'e'
              }]
            }]
          }]
        }]
      }]
    }, {
      relText: 'g', andParams: [{ name: 'g' }]
    }]
  }
}]

describe('logic-tree', () => {
  examples.forEach(ex => {
    test(ex.name, () => {
      expect(build(ex.input).root).toEqual(ex.want)
    })
  })
});
