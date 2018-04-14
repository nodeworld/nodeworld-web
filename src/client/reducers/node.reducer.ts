import { NodeAction, NodeActionType } from "../actions/node.actions";

import { Node } from "../models/node.model";

const initialState = { node: null };

export interface NodeReducerState {
    node: Node | null;
}

export const NodeReducer = (state: NodeReducerState = initialState, action: NodeAction) => {
    switch(action.type) {
        case NodeActionType.SetNode:
            return Object.assign({}, state, { node: action.node })
        case NodeActionType.SetNodeError:
            console.error(action.message);
            return state;
        default:
            return state;
    }
}