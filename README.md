# Logic tree

Build a JSON object from a logic expression string

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
