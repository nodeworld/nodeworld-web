import * as NodeApi from "../api/node.api";
import { Node } from "../models/node.model";
import { manageLiveNodeConnection } from "../utils/live.utils";
import { clearMessages } from "./log.actions";

export type NodeAction = SetNodeAction | SetNodeErrorAction;

export enum NodeActionType {
    SetNode = "SET_NODE",
    SetNodeError = "SET_NODE_ERROR"
}

export interface SetNodeAction {
    type: NodeActionType.SetNode,
    node: Node
}

export interface SetNodeErrorAction {
    type: NodeActionType.SetNodeError,
    message: string
}

export const setNode = (node: Node): SetNodeAction => ({
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
            console.log("Joining node " + name);
            const node = await NodeApi.getNode(name);
            NodeApi.joinNode(name);
            dispatch(clearMessages());
            dispatch(setNode(node));
        } catch(err) {
            setTimeout(() => joinNode("main"), 1000);
            dispatch(setNodeError(err));
        }
    }
}