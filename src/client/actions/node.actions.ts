import { Map } from "immutable";

import * as NodeApi from "../api/node.api";
import { WebNode } from "../models/node.model";

export type NodeAction = SetNodeAction | SetNodeErrorAction;

export enum NodeActionType {
    SetNode = "SET_NODE",
    SetNodeError = "SET_NODE_ERROR"
}

export interface SetNodeAction {
    type: NodeActionType.SetNode,
    node: WebNode
}

export interface SetNodeErrorAction {
    type: NodeActionType.SetNodeError,
    message: string
}

export const setNode = (node: WebNode): SetNodeAction => ({
    type: NodeActionType.SetNode,
    node
});

export const setNodeError = (message: string): SetNodeErrorAction => ({
    type: NodeActionType.SetNodeError,
    message
});

export const joinNode = (name: string) => {
    return async (dispatch: any) => {
        try {
            const node = await NodeApi.getNode(name);
            dispatch(setNode(node));
        } catch(err) {
            setTimeout(() => joinNode("main"), 1000);
            dispatch(setNodeError(err));
        }
    }
}