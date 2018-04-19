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

export const printMessage = (message: Partial<Message>) => async (dispatch: Function) => await dispatch(addMessage(buildMessage(message)));

export const printSystemMessage = (content: string) => printMessage({ type: MessageType.SYSTEM, content });

export const sendMessage = (type: MessageType, content: string) => {
    return async (dispatch: Function, getState: () => CombinedReducerState) => {
        try {
            if(!getState().visitor.visitor) throw new Error("You must be logged in to send messages. Type /login to log in, or /register to create a new account.");
            const node = getState().node.node;
            if(!node) throw new Error("You must be in a node to send commands.");
            if(!content.trim()) return;
            const message = await NodeAPI.sendMessage(node.id, type, content);
            await dispatch(printMessage(message));
        } catch(e) { dispatch(printSystemMessage(`Error: ${e.message}`)); }
    }
}

export const sendCommand = (content: string) => {
    return async (dispatch: Function, getState: () => CombinedReducerState) => {
        try {
            const visitor = getState().visitor.visitor;
            const node = getState().node.node;
            const command = parseCommand(content);
            if(command.name === "me") {
                if(!visitor) throw new Error("You must be logged in to use that command.");
                const me_action = command.args.join(" ");
                await dispatch(sendMessage(MessageType.ACTION, me_action));
            } else {
                await dispatch(printMessage({ type: MessageType.ACTION, name: visitor ? visitor.name : "anonymous", content }));
                const local_success = await runLocalCommand({ dispatch, getState, command });
                if(!local_success) {
                    if(!visitor) throw new Error("You must be logged in to use non-local commands. Type /login to log in, or /register to create a new account.");
                    if(node) await NodeAPI.runCommand(node["id"], command);
                }
            }
        } catch(e) { dispatch(printSystemMessage(`Error: ${e.message}`)); }
    }
}