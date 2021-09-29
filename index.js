/* eslint-disable @typescript-eslint/no-var-requires */

const LogicTree = require('./src/logic-tree')
const BracketTree = require('./src/bracket-tree')

module.exports = function (expr) {
    const bracketTree = new BracketTree()
    bracketTree.applyExpression(expr)
    const logicTree = new LogicTree(bracketTree.root)
    return logicTree.root
}
