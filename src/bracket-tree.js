const BRACKET_OPENED = '(';
const BRACKET_CLOSED = ')';

class TreeNode {
  constructor(parentNode) {
    this.text = '';
    this.nodes = [];

    Object.defineProperty(this, 'getParent', {
      enumerable: false,
      writable: false,
      value: () => parentNode
    });

    // getParent: (cn => cn).bind(null, currentNode)
  }
}

const buildTree = (expr) => {
  const root = new TreeNode(null);

  let currentNode = root;

  for (let i = 0; i < expr.length; i += 1) {
    const s = expr[i];
    if (s === BRACKET_OPENED) {
      const newNode = new TreeNode(currentNode);
      currentNode.nodes.push(newNode);
      currentNode.text += `node${currentNode.nodes.length - 1}`;
      currentNode = newNode;
    } else if (s === BRACKET_CLOSED) {
      currentNode = currentNode.getParent();
    } else {
      currentNode.text = (currentNode.text || '') + s;
    }
  }

  return root;
};

class Tree {
  constructor(expr) {
    const tree = buildTree(expr);

    // Add parenthesis' outside of a whole expression
    //   if two or more parameters in a root (separated by AND OR for exapmle)
    //   to have only one root item
    // tree.text !== 'node0' && tree.text !== '!node0'
    if (tree.text.indexOf(' ') >= 0) {
      this.text = 'node0';
      this.nodes = [tree];
    } else {
      this.text = tree.text;
      this.nodes = tree.nodes;
    }
  }
}

module.exports = Tree;
