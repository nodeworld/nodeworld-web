export interface Visitor {
    name: string;
    email?: string;
}

export interface ServerVisitor extends Visitor {
    visitor_id: string;
}

export interface WebVisitor extends Visitor {
    id: string;
}