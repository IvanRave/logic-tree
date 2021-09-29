import { BracketNode } from './node';
import { IAndParam, IBracketNode, IOrParam, IRelText } from './types';

const OPERATOR_OR = ' OR ';
const OPERATOR_AND = ' AND ';

// split one bracket node to many OrParam nodes
const buildAndParam = (bracketNodes: Array<IBracketNode>, paramText: IRelText): IAndParam => {
  const andParam = BracketNode.paramFromRelText(paramText) as IAndParam
  const bracketNode = bracketNodes[BracketNode.decodeNodeID(andParam.name)]

  if (!bracketNode) { return andParam }

  andParam.relText = bracketNode.relText

  andParam.orParams = bracketNode.relText
    .split(OPERATOR_OR)
    .map(orPartName => buildOrParam(bracketNode.nodes, orPartName))

  return andParam
}

// split one OrParam node to many AndParam nodes
const buildOrParam = (bracketNodes: Array<IBracketNode>, orPartText: string): IOrParam => {
  return {
    relText: orPartText,
    andParams: orPartText
      .split(OPERATOR_AND)
      .map(andParamName => buildAndParam(bracketNodes, andParamName))
  };
}

class LogicTree {

  root: IAndParam

  // convert the bracket tree to a logic tree
  constructor(bracketTreeRoot: IBracketNode) {
    this.root = buildAndParam(bracketTreeRoot.nodes, bracketTreeRoot.relText)
  }

  // ast tree excluding all undefined values
  // ast(): IAndParam {
  //   return reject(equals(undefined))(this.root);
  // }
}

export default LogicTree
