import { v1 as uuidv1 } from "uuid";

import * as NodeAPI from "../api/node.api";

import { Visitor } from "../models/visitor.model";
import { Message, MessageType, buildMessage } from "../models/message.model";
import { Command } from "../models/command.model";
import { parseCommand, runLocalCommand } from "../utils/command.utils";
import { NodeInputMode } from "../components/node/node-input";
import { CombinedReducerState } from "../reducers";

export type LogAction = AddMessageAction | AddMessageErrorAction | ClearMessagesAction | SetInputModeAction | SetPromptAction | ResolvePromptAction;

export enum LogActionType {
    AddMessage = "ADD_MESSAGE",
    AddMessageError = "ADD_MESSAGE_ERROR",
    ClearMessages = "CLEAR_MESSAGES",
    SetInputMode = "SET_INPUT_MODE",
    SetPrompt = "SET_PROMPT",
    ResolvePrompt = "RESOLVE_PROMPT"
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

export interface SetInputModeAction {
    type: LogActionType.SetInputMode;
    mode: NodeInputMode
}

export interface SetPromptAction {
    type: LogActionType.SetPrompt;
    text: string;
    callback: Function;
}

export interface ResolvePromptAction {
    type: LogActionType.ResolvePrompt;
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

export const setInputMode = (mode: NodeInputMode): SetInputModeAction => ({ type: LogActionType.SetInputMode, mode });

export const setPrompt = (text: string, callback: Function): SetPromptAction => ({ type: LogActionType.SetPrompt, text, callback });

export const resolvePrompt = (): ResolvePromptAction => ({ type: LogActionType.ResolvePrompt });

export const sendMessage = (type: MessageType, content: string) => {
    return async (dispatch: Function, getState: () => CombinedReducerState) => {
        try {
            if(!getState().visitor.visitor) throw { errors: { message: "You must be logged in to send messages. Type /login to login, or /register to create a new account." }};
            const node_id = getState().node.node!.id;
            const message = await NodeAPI.sendMessage(node_id, type, content);
            dispatch(addMessage(buildMessage(message)));
        } catch(e) {
            await dispatch(addMessage(buildMessage({ type: MessageType.SYSTEM, content: `Error: ${e.errors.message}` })));
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
                if(!visitor) {
                    await dispatch(addMessage(buildMessage({ type: MessageType.SYSTEM, content: "You must be logged in to use this command." })));
                    return;
                }
                const me_action = command.args.join(" ");
                await dispatch(sendMessage(MessageType.ACTION, me_action));
            } else {
                await dispatch(addMessage(buildMessage({ type: MessageType.ACTION, name: visitor ? visitor.name : "anonymous", content })));
                const local_success = await runLocalCommand({ dispatch, visitor, command });
                if(!local_success)
                    if(visitor)
                        await NodeAPI.runCommand(node["id"], command);
                    else
                        throw { errors: { message: "You must be logged in to use non-local commands. Type /login to login, or /register to create a new account." } };
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