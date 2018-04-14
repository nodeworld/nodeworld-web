import Thunk from "redux-thunk";

import { createStore, applyMiddleware } from "redux";

import { reducerTree } from "./reducers";
import { VisitorReducerState } from "./reducers/visitor.reducer";
import { NodeReducerState } from "./reducers/node.reducer";
import { LogReducerState } from "./reducers/log.reducer";

const middleware = applyMiddleware(Thunk);

export const store = createStore(reducerTree, middleware);