import { NodeAction, NodeActionType } from "../actions/node.actions";

import { Node } from "../models/node.model";
import { Visitor } from "../models/visitor.model";

const initialState = { node: undefined };

export interface NodeVisitorState extends Node {
    visitors: Visitor[];
}

export interface NodeReducerState {
    node?: NodeVisitorState;
}

export const NodeReducer = (state: NodeReducerState = initialState, action: NodeAction) => {
    switch(action.type) {
        case NodeActionType.SetNode:
            if(action.node === undefined)
                return Object.assign({}, state, { node: undefined });
            else
                return Object.assign({}, state, { node: { ...action.node, visitors: [] } })
        case NodeActionType.SetNodeError:
            console.error(action.message);
            return state;
        case NodeActionType.SetNodeVisitors:
            return Object.assign({}, state, { node: { ...state.node, visitors: action.visitors }});
        default:
            return state;
    }
}