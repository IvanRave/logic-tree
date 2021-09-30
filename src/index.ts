import LogicTree from './logic-tree'
import BracketTree from './bracket-tree'

exports.default = function (logicExpression: string) {
    const bracketTree = new BracketTree()
    bracketTree.applyExpression(logicExpression)
    const logicTree = new LogicTree(bracketTree.root)
    return logicTree.root
}
