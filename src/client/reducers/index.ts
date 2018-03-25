import { combineReducers } from "redux";

import { LogReducer } from "./log.reducer";
import { NodeReducer } from "./node.reducer";
import { VisitorReducer } from "./visitor.reducer";

const reducerTree = combineReducers({
    node: NodeReducer as any,
    log: LogReducer as any,
    visitor: VisitorReducer as any
});

export { reducerTree };