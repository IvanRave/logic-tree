const reject  = require('ramda/src/reject');
const equals  = require('ramda/src/equals');

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
    this.nodes = treeNodes;
    this.rootParam = rootParam;

    const rootParamName = this.rootParam.replace(REGEX_NEGATION, '');
    const isNegation = REGEX_NEGATION.test(this.rootParam);
    const associative = findAssociative(rootParamName, this.nodes);

    if (isNegation) {
      this.isNegation = isNegation;
    }

    this.paramName = rootParamName;
    this.content = associative && associative.text;
    this.orParams = associative && associative.text.split(OPERATOR_OR).map((orPart) => {
      // !c AND p AND !node0
      const andParams = orPart
        .split(OPERATOR_AND)
        .map(andParam => new LogicTree(associative.nodes, andParam).getAst());

      return {
        text: orPart,
        andParams
      };
    });
  }

  getAst() {
    return reject(equals(undefined))({
      isNegation: this.isNegation,
      name: this.paramName,
      content: this.content,
      orParams: this.orParams
    });
  }
}

module.exports = LogicTree;
