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


## Logical operators

- [Logical negation NOT](https://en.wikipedia.org/wiki/Negation)
- [Logical conjunction AND](https://en.wikipedia.org/wiki/Logical_conjunction)
  - [Logical NAND](https://en.wikipedia.org/wiki/Sheffer_stroke)
- [Logical disjunction OR](https://en.wikipedia.org/wiki/Logical_disjunction)
  - [Logical NOR](https://en.wikipedia.org/wiki/Logical_NOR)
  - [Logical exclusive disjunction XOR](https://en.wikipedia.org/wiki/Exclusive_or)
  - [Logical equality XNOR](https://en.wikipedia.org/wiki/Logical_equality)

## Logical truth table

| a | b | AND | OR  | NAND| NOR | XOR | XNOR|
|---|---|:---:|:---:|:---:|:---:|:---:|:---:|
| 0 | 0 |  0  |  0  |  1  |  1  |  0  |  1  |
| 0 | 1 |  0  |  1  |  1  |  0  |  1  |  0  |
| 1 | 0 |  0  |  1  |  1  |  0  |  1  |  0  |
| 1 | 1 |  1  |  1  |  0  |  0  |  0  |  1  |

- a NAND b == NOT(A AND B)
- a XOR b  == (a OR b) AND (a NAND b)
- a XNOR b == NOT(a XOR b)

## Binary boolean expresssion tree

![Binary boolean expression tree](https://upload.wikimedia.org/wikipedia/commons/a/a1/Exp-tree-ex-13.svg)

https://en.wikipedia.org/wiki/Binary_expression_tree
