export interface Node {
    name: string;
    owner_id: string;
    greeting?: string;
}

export interface WebNode extends Node {
    id: string;
}

export interface ServerNode extends Node {
    node_id: string;
}