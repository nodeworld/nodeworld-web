import { Visitor } from "./visitor.model";
import { CombinedReducerState } from "../reducers";

export interface WebCommandContext {
    command: Command;
    dispatch: Function;
    getState: () => CombinedReducerState
}

export interface Command {
    name: string;
    raw: string;
    args: string[];
}