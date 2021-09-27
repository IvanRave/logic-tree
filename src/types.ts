export interface INode {
    // text is description of the node, for example:
    // a OR b AND node0 OR node1 AND node2
    // it defines relationship between underlying nodes
    relText: string,

    // nodes is a list of child nodes
    nodes: Array<INode>

    // append a node to child nodes and relText message.
    appendInnerNode?(n: INode): void

    // a helper method to accumulate the relText symbol by symbol
    appendInnerChar?(s: string): void

    // whether the node includes few elements, e.g. 'a AND b'
    // it can be used to add a wrapper to the root node
    hasManyElements?(): boolean
}

export interface IParentable{
    // returns a parent node (a root or other node)
    getParent(): INode | (INode & IParentable)
}

export interface IAndParam {
    // if name exists, the text property can be empty
    // it is just used to create name property
    relText?: string,

    // parameter name
    name: string,

    // whether the parameter has negation
    isNegation?: boolean,

    // inner OR parameters
    orParams?: Array<IOrParam>
}

export interface IOrParam {
    // describes inner AND parameters as a text message
    relText: string,

    // inner AND parameters
    andParams: Array<IAndParam>
}

