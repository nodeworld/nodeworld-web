import Thunk from "redux-thunk";

import { createStore, applyMiddleware } from "redux";

import { reducerTree } from "./reducers";

const middleware = applyMiddleware(Thunk);

export const store = createStore(reducerTree, middleware);