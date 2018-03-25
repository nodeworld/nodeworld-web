import { NodeAction, NodeActionType } from "../actions/node.actions";

import { WebNode } from "../models/node.model";

const initialState = { node: null };

export interface NodeReducerState {
    node: WebNode | null;
}

export const NodeReducer = (state: NodeReducerState, action: NodeAction) => {
    switch(action.type) {
        case NodeActionType.SetNode:
            return Object.assign({}, state, { node: action.node })
        case NodeActionType.SetNodeError:
            console.error(action.message);
            return state;
        default:
            return state ? state : initialState;
    }
}