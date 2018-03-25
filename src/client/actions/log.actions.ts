import { v1 as uuidv1 } from "uuid";

import * as NodeAPI from "../api/node.api";

import { runLocalCommand } from "../utils/command.utils";

import { WebVisitor } from "../models/visitor.model";
import { WebMessage, MessageType } from "../models/message.model";
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
    message: WebMessage;
}

export interface ClearMessagesAction {
    type: LogActionType.ClearMessages
}

export interface AddMessageErrorAction {
    type: LogActionType.AddMessageError;
    message: string;
}

export const addMessage = (message: WebMessage): AddMessageAction => ({
    type: LogActionType.AddMessage,
    message: {
        ...message,
        id: message.id ? message.id : uuidv1(),
        sent_at: message.sent_at ? message.sent_at : new Date().toISOString()
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
            const node_id = getState()["node"]["node"]["id"];
            const message = await NodeAPI.sendMessage(node_id, type, content);
            dispatch(addMessage(message));
        } catch(e) {
            console.error(e);
        }
    }
}

export const sendCommand = (content: string) => {
    return async (dispatch: Function, getState: Function) => {
        try {
            const visitor = getState()["visitor"]["visitor"];
            const node = getState()["node"]["node"];
            const command = parseCommand(content);
            if(command.name === "me") {
                const me_action = command.args.join(" ");
                await dispatch(sendMessage(MessageType.ACTION, me_action));
            } else {
                await dispatch(addMessage({ type: MessageType.ACTION, name: visitor.name, content } as any));
                const local_success = await runLocalCommand({ dispatch, visitor, command });
                if(!local_success)
                    await NodeAPI.runCommand(node["id"], command);
            }
        } catch(e) { console.error(e); }
    }
}

export const addRecentMessages = () => {
    return async (dispatch: Function, getState: Function) => {
        try {
            const node_id = getState()["node"]["node"]["id"];
            const messages = await NodeAPI.getMessages(node_id);
            messages.forEach(message => dispatch(addMessage(message)));
        } catch(e) { console.error(e); }
    }
}

export const sendNodeGreeting = () => {
    return async (dispatch: Function, getState: Function) => {
        try {
            const node = getState()["node"]["node"];
            await dispatch(addMessage({ type: MessageType.SYSTEM, content: `Joined ${node["name"]}` } as any));
            await dispatch(addMessage({ type: MessageType.SYSTEM, content: `"${node["greeting"]}"` } as any));
        } catch(e) { console.error(e); }
    }
}