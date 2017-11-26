// type OrParam = {
//   text: string,
//   andParams: Array<AndParam>
// }

// type AndParam = {
//   isNegation: bool,
//   paramName: string,
//   paramContent: string,
//   orParams: Array<OrParam>
// }

// type Association = {
//   orParam: OrParam,
//   andParam: AndParam
// }

const REGEX_NODE = /^node(\d+)$/;
const REGEX_NEGATION = /^!/;
const OPERATOR_OR = ' OR ';
const OPERATOR_AND = ' AND ';

const findAssociative = (rootParamName, treeNodes) => {
  const rootMatching = rootParamName.match(REGEX_NODE);
  const rootNodeEntityIndex = rootMatching ? +rootMatching[1] : -1;
  return treeNodes[rootNodeEntityIndex];
};

class LogicTree {
  constructor(treeNodes, rootParam) {
    const rootParamName = rootParam.replace(REGEX_NEGATION, '');
    const isNegation = REGEX_NEGATION.test(rootParam);
    const associative = findAssociative(rootParamName, treeNodes);

    this.isNegation = isNegation ? true : undefined;
    this.paramName = rootParamName;
    this.paramContent = associative && associative.text;
    this.orParams = associative && associative.text.split(OPERATOR_OR).map((orPart) => {
      // !c AND p AND !node0
      const andParams = orPart
        .split(OPERATOR_AND)
        .map(andParam => new LogicTree(associative.nodes, andParam));

      return {
        text: orPart,
        andParams
      };
    });
  }
}

module.exports = LogicTree;
