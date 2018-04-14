import { v1 as uuidv1 } from "uuid";

import * as NodeAPI from "../api/node.api";

import { runLocalCommand } from "../utils/command.utils";

import { Visitor } from "../models/visitor.model";
import { Message, MessageType, buildMessage } from "../models/message.model";
import { Command } from "../models/command.model";

import { parseCommand } from "../utils/command.utils";

export type LogAction = AddMessageAction | AddMessageErrorAction | ClearMessagesAction;

export enum LogActionType {
    AddMessage = "ADD_MESSAGE",
    AddMessageError = "ADD_MESSAGE_ERROR",
    ClearMessages = "CLEAR_MESSAGES"
}

export interface AddMessageAction {
    type: LogActionType.AddMessage;
    message: Message;
}

export interface ClearMessagesAction {
    type: LogActionType.ClearMessages
}

export interface AddMessageErrorAction {
    type: LogActionType.AddMessageError;
    message: string;
}

export const addMessage = (message: Message): AddMessageAction => ({
    type: LogActionType.AddMessage,
    message: {
        ...message,
    }
});

export const addMessageError = (message: string): AddMessageErrorAction => ({
    type: LogActionType.AddMessageError,
    message
});

export const clearMessages = (): ClearMessagesAction => ({ type: LogActionType.ClearMessages });

export const sendMessage = (type: MessageType, content: string) => {
    return async (dispatch: Function, getState: Function) => {
        try {
            const node_id = getState().node.node.id;
            const message = await NodeAPI.sendMessage(node_id, type, content);
            dispatch(addMessage(buildMessage(message)));
        } catch(e) {
            console.error(e);
        }
    }
}

export const sendCommand = (content: string) => {
    return async (dispatch: Function, getState: Function) => {
        try {
            const visitor = getState().visitor.visitor;
            const node = getState().node.node;
            const command = parseCommand(content);
            if(command.name === "me") {
                const me_action = command.args.join(" ");
                await dispatch(sendMessage(MessageType.ACTION, me_action));
            } else {
                await dispatch(addMessage(buildMessage({ type: MessageType.ACTION, name: visitor.name, content })));
                const local_success = await runLocalCommand({ dispatch, visitor, command });
                if(!local_success)
                    await NodeAPI.runCommand(node["id"], command);
            }
        } catch(e) { await dispatch(addMessage(buildMessage({ type: MessageType.SYSTEM, content: `Error: ${e.errors.message}` }))); }
    }
}

export const addRecentMessages = () => {
    return async (dispatch: Function, getState: Function) => {
        try {
            const node_id = getState().node.node.id;
            const messages = await NodeAPI.getMessages(node_id);
            messages.forEach(message => dispatch(addMessage(message)));
        } catch(e) { console.error(e); }
    }
}