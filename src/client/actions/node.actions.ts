import * as NodeApi from "../api/node.api";
import { printSystemMessage } from "./log.actions";
import { Node } from "../models/node.model";
import { MessageType } from "../models/message.model";
import { Visitor } from "../models/visitor.model";
import { manageLiveNodeConnection } from "../utils/live.utils";
import { CombinedReducerState } from "../reducers";

export type NodeAction = SetNodeAction | SetNodeErrorAction | SetNodeVisitorsAction;

export enum NodeActionType {
    SetNode = "SET_NODE",
    SetNodeError = "SET_NODE_ERROR",
    SetNodeVisitors = "SET_NODE_VISITORS"
}

export interface SetNodeAction {
    type: NodeActionType.SetNode,
    node?: Node
}

export interface SetNodeErrorAction {
    type: NodeActionType.SetNodeError,
    message: string
}

export interface SetNodeVisitorsAction {
    type: NodeActionType.SetNodeVisitors,
    visitors: Visitor[];
}

export const setNode = (node?: Node): SetNodeAction => ({
    type: NodeActionType.SetNode,
    node
});

export const setNodeError = (message: string): SetNodeErrorAction => ({
    type: NodeActionType.SetNodeError,
    message
});

export const setNodeVisitors = (visitors: Visitor[]): SetNodeVisitorsAction => ({
    type: NodeActionType.SetNodeVisitors,
    visitors
});

export const showVisitorsList = () => {
    return async (dispatch: Function, getState: () => CombinedReducerState) => {
        try {
            const node = getState().node.node;
            const visitor = getState().visitor.visitor;
            if(!node) throw new Error("You are not in a node.");
            if(node.visitors.length > 1) {
                const names = node.visitors.map(v => visitor && visitor.id === v.id ? `${v.name} (you)` : v.name).sort().join(", ");
                dispatch(printSystemMessage(`There are ${node.visitors.length} visitors in this node: ${names}`));
            } else {
                if(visitor && visitor.id === node.visitors[0].id)
                    dispatch(printSystemMessage("You are the only visitor in this node."));
                else
                    dispatch(printSystemMessage(`There is 1 visitor in this node: ${node.visitors[0].name}`));
            }
        } catch(e) {
            dispatch(printSystemMessage(`Error: ${e.message}`));
        }
    }
}

export const joinNode = (name: string) => {
    return async (dispatch: any, getState: () => CombinedReducerState) => {
        try {
            const node = await NodeApi.getNode(name);
            if(getState().node.node) await dispatch(leaveNode());
            dispatch(printSystemMessage(`Joining ${node.name}...`));
            NodeApi.joinNode(name);
            dispatch(setNode(node));
        } catch(e) {
            dispatch(printSystemMessage(`Error: ${e.message}`));
        }
    }
}

export const leaveNode = () => {
    return async (dispatch: any) => {
        NodeApi.leaveNode();
        dispatch(setNode(undefined));
    }
}