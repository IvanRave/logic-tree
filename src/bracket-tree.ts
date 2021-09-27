import { Node } from './node';
import { INode, IParentable } from './types';

const BRACKET_OPENED = '(';
const BRACKET_CLOSED = ')';

class NodeWithParent extends Node implements IParentable {
  // getParent returns a parent node
  //
  // it return null for the root node
  getParent: () => INode | (INode & IParentable)

  constructor(parentNode: INode) {
    super()

    // this.getParent = () => parentNode
    Object.defineProperty(this, 'getParent', {
      enumerable: false,
      writable: false,
      value: () => parentNode
    });
  }
}

const buildTree = (root: INode, expr: string): INode => {
  let currentNode: INode | NodeWithParent = root
  for (const char of expr) {
    switch (char) {
      // move to the next node
      case BRACKET_OPENED: {
        const nextNode = new NodeWithParent(currentNode);
        currentNode.appendInnerNode(nextNode)
        currentNode = nextNode;
        break
      }
      // return to the parent node
      case BRACKET_CLOSED: {
        const parentNode = (currentNode as NodeWithParent).getParent()
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
    return new Node(Node.encodeNodeID(0), [root])
  }

  return root;
};

class BracketTree {
  root: INode

  constructor() {
    this.root = new Node();
  }

  applyExpression(expr: string) {
    this.root = buildTree(this.root, expr);
  }
}

export default BracketTree
