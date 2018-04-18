import * as NodeApi from "../api/node.api";
import { Node } from "../models/node.model";
import { manageLiveNodeConnection } from "../utils/live.utils";
import { clearMessages, addMessage } from "./log.actions";
import { buildMessage, MessageType } from "../models/message.model";
import { CombinedReducerState } from "../reducers";

export type NodeAction = SetNodeAction | SetNodeErrorAction;

export enum NodeActionType {
    SetNode = "SET_NODE",
    SetNodeError = "SET_NODE_ERROR"
}

export interface SetNodeAction {
    type: NodeActionType.SetNode,
    node?: Node
}

export interface SetNodeErrorAction {
    type: NodeActionType.SetNodeError,
    message: string
}

export const setNode = (node?: Node): SetNodeAction => ({
    type: NodeActionType.SetNode,
    node
});

export const setNodeError = (message: string): SetNodeErrorAction => ({
    type: NodeActionType.SetNodeError,
    message
});

export const joinNode = (name: string) => {
    return async (dispatch: any, getState: () => CombinedReducerState) => {
        try {
            const node = await NodeApi.getNode(name);
            if(getState().node.node) await dispatch(leaveNode());
            await dispatch(addMessage(buildMessage({ type: MessageType.SYSTEM, content: `Joining ${node.name}...` })));
            NodeApi.joinNode(name);
            dispatch(setNode(node));
        } catch(e) {
            await dispatch(addMessage(buildMessage({ type: MessageType.SYSTEM, content: `Error: ${e.message}` })));
        }
    }
}

export const leaveNode = () => {
    return async (dispatch: any) => {
        NodeApi.leaveNode();
        dispatch(setNode(undefined));
    }
}