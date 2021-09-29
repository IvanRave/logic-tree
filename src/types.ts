export interface IBracketNode {
    // text is description of the node, for example:
    // a OR b AND node0 OR node1 AND node2
    // it defines relationship between underlying nodes
    relText: IRelText,

    // nodes is a list of child nodes
    nodes: Array<IBracketNode>

    // append a node to child nodes and relText message.
    appendInnerNode?(n: IBracketNode): void

    // a helper method to accumulate the relText symbol by symbol
    appendInnerChar?(s: string): void

    // whether the node includes few elements, e.g. 'a AND b'
    // it can be used to add a wrapper to the root node
    hasManyElements?(): boolean
}

export interface IParentable extends IBracketNode {
    // returns a parent node (a root or other node)
    getParent(): IBracketNode | (IBracketNode & IParentable)
}

// TODO: opaque for better type checking
export type IRelText = string

export interface INegationParam {
    // parameter name
    name: string,

    // whether the parameter has negation
    // it is undefined if false
    isNegation?: boolean,
}

export interface IAndParam extends INegationParam {
    // if name exists, the text property can be empty
    // it is just used to create name property
    relText?: IRelText,

    // inner OR parameters
    orParams?: Array<IOrParam>
}

export interface IOrParam {
    // describes inner AND parameters as a text message
    relText: IRelText,

    // inner AND parameters
    andParams: Array<IAndParam>
}


