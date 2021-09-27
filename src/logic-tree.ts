import { Node } from './node';
import { IAndParam, INode } from './types';

const REGEX_NEGATION = /^!/;
const OPERATOR_OR = ' OR ';
const OPERATOR_AND = ' AND ';

const buildTree = (treeNodes: Array<INode>, paramText: string): IAndParam => {
  const paramName = paramText.replace(REGEX_NEGATION, '');
  const associative = treeNodes[Node.decodeNodeID(paramName)]

  return {
    name: paramName,
    isNegation: REGEX_NEGATION.test(paramText) || undefined,
    relText: associative?.relText,
    orParams: associative?.relText.split(OPERATOR_OR).map(orPartName => {
      // !c AND p AND !node0
      const andParams = orPartName
        .split(OPERATOR_AND)
        .map(andParamName => buildTree(associative.nodes, andParamName));

      return {
        relText: orPartName,
        andParams
      };
    })
  }
}

class LogicTree {

  root: IAndParam

  // convert the bracket tree to a logic tree
  constructor(bracketTreeRoot: INode) {
    this.root = buildTree(bracketTreeRoot.nodes, bracketTreeRoot.relText)
  }

  // ast tree excluding all undefined values
  // ast(): IAndParam {
  //   return reject(equals(undefined))(this.root);
  // }
}

export default LogicTree
