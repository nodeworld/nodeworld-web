import { combineReducers } from "redux";

import { LogReducer, LogReducerState } from "./log.reducer";
import { NodeReducer, NodeReducerState } from "./node.reducer";
import { VisitorReducer, VisitorReducerState } from "./visitor.reducer";

export interface CombinedReducerState {
    visitor: VisitorReducerState,
    node: NodeReducerState,
    log: LogReducerState
}

const reducerTree = combineReducers<CombinedReducerState>({
    node: NodeReducer,
    log: LogReducer,
    visitor: VisitorReducer
});

export { reducerTree };