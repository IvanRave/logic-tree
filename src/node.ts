import {
    INegationParam, IBracketNode,
    IParentable, IRelText
} from './types'

const NODE_ID_PREFIX = 'node'
const NODE_ID_REGEX = /^node(\d+)$/;

const REGEX_NEGATION = /^!/;

export class BracketNode implements IBracketNode {
    constructor(public relText: IRelText = '', public nodes: Array<IBracketNode> = []) { }

    appendInnerNode(innerNode: IBracketNode) {
        this.nodes.push(innerNode);
        this.relText += BracketNode.encodeNodeID(this.nodes.length - 1)
    }

    appendInnerChar(char: string) {
        this.relText += char
    }

    // e.g. 'a AND b' or 'node1 OR node2'
    hasManyElements() {
        return this.relText.indexOf(' ') >= 0
    }

    private static encodeNodeID(index: number) {
        return `${NODE_ID_PREFIX}${index}`
    }

    static decodeNodeID(name: string) {
        const matching = name.match(NODE_ID_REGEX);
        if (matching && matching[1]) {
            return +matching[1]
        }
        return -1
    }

    // !a => { true,  a }
    // !node0 => { true,  node0 }
    // TODO: complex expressions if needed, e.g. !a AND !b
    // TODO: multiple negation if needed, e.g. !!a
    static paramFromRelText(relText: IRelText): INegationParam {
        return {
            isNegation: REGEX_NEGATION.test(relText) || undefined,
            name: relText.replace(REGEX_NEGATION, '')
        }
    }
}

export class BracketNodeWithParent extends BracketNode implements IParentable {
    // getParent returns a parent node
    getParent: () => IBracketNode | IParentable

    constructor(parentNode: IBracketNode) {
        super()

        // this.getParent = () => parentNode
        Object.defineProperty(this, 'getParent', {
            enumerable: false,
            writable: false,
            value: () => parentNode
        });
    }
}
