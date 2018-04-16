import { Visitor } from "./visitor.model";

export interface WebCommandContext {
    command: Command;
    dispatch: Function;
    visitor: Visitor | null;
}

export interface Command {
    name: string;
    raw: string;
    args: string[];
}