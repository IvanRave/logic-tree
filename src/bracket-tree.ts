import { BracketNode, BracketNodeWithParent } from './node';
import { IBracketNode, IParentable } from './types';

const BRACKET_OPENED = '(';
const BRACKET_CLOSED = ')';

const buildTree = (root: IBracketNode, expr: string): IBracketNode => {
  let currentNode: IBracketNode | IParentable = root
  for (const char of expr) {
    switch (char) {
      // move to the next node
      case BRACKET_OPENED: {
        const nextNode = new BracketNodeWithParent(currentNode);
        currentNode.appendInnerNode(nextNode)
        currentNode = nextNode;
        break
      }
      // return to the parent node
      case BRACKET_CLOSED: {
        const parentNode = (currentNode as IParentable).getParent()
        if (!parentNode) {
          throw new Error(`no parent node for a closed bracket: ${expr}`)
        }
        currentNode = parentNode;
        break
      }
      default: {
        currentNode.appendInnerChar(char)
      }
    }
  }

  // the root must contain 1 node only (by design)
  // so add a wrapper (aka brackets) if it has few elements.
  if (root.hasManyElements()) {
    const wrapperNode = new BracketNode()
    wrapperNode.appendInnerNode(root)
    return wrapperNode
  }

  return root;
};

class BracketTree {
  root: IBracketNode
  constructor() { this.root = new BracketNode() }

  applyExpression(expr: string) {
    this.root = buildTree(this.root, expr);
  }
}

export default BracketTree
