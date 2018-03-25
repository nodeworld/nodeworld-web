import { WebVisitor } from "./visitor.model";

export interface WebCommandContext {
    command: Command;
    dispatch: Function;
    visitor: WebVisitor
}

export interface Command {
    name: string;
    raw: string;
    args: string[];
}