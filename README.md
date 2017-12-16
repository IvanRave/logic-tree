#  Abstract syntax tree for logic expressions

Build an AST (JSON object) from a logic expression string

## Input

```
    const logicExpression = 'a AND b OR c';
```

## Processing

```
    const bracketTree = new BracketTree(logicExpression);
    const logicTree = new LogicTree(bracketTree.nodes, bracketTree.text).getAst();
```

## Output

```
    console.log(logicTree);
    
    {
      name: 'node0',
      content: 'a AND b OR c',
      orParams: [{
        text: 'a AND b',
        andParams: [{ name: 'a' }, { name: 'b' }]
      }, {
        text: 'c',
        andParams: [{ name: 'c' }]
      }]
    }
```

## Entity-relationship model

![Logic tree relationship](./docs/and-or.png)


## Boolean expression

- [Logical conjunction](https://en.wikipedia.org/wiki/Logical_conjunction)
- [Logical disjunction] (https://en.wikipedia.org/wiki/Logical_disjunction)
  - [Logical exclusive disjunction] (https://en.wikipedia.org/wiki/Exclusive_or)
- [Logical negation] (https://en.wikipedia.org/wiki/Negation)

[First-order logic](https://en.wikipedia.org/wiki/First-order_logic)

## Binary boolean expresssion tree

![Binary boolean expression tree](https://upload.wikimedia.org/wikipedia/commons/a/a1/Exp-tree-ex-13.svg)

https://en.wikipedia.org/wiki/Binary_expression_tree
