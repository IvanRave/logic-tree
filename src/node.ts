import { INode } from './types'

const NODE_ID_PREFIX = 'node'
const NODE_ID_REGEX = /^node(\d+)$/;

export class Node implements INode {
    constructor(public relText: string = '', public nodes: Array<INode> = []) {
        this.relText = relText
        this.nodes = nodes
    }

    appendInnerNode(nextNode: INode) {
        this.nodes.push(nextNode);
        this.relText += Node.encodeNodeID(this.nodes.length - 1)
    }

    appendInnerChar(char: string) {
        this.relText += char
    }

    hasManyElements() {
        // e.g. 'a AND b' or 'node1 OR node2'
        return this.relText.indexOf(' ') >= 0
    }

    static encodeNodeID(index: number) {
        return `${NODE_ID_PREFIX}${index}`
    }

    static decodeNodeID(name: string) {
        const matching = name.match(NODE_ID_REGEX);
        if (matching && matching[1]) {
            return +matching[1]
        }
        return -1
    }
}
