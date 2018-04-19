import { LogAction, LogActionType } from "../actions/log.actions";
import { Message } from "../models/message.model";
import { NodeInputMode } from "../components/node/node-input";

const initialState = { messages: [], input_mode: NodeInputMode.CHAT };

export interface LogReducerState {
    messages: Array<Message>;
    input_mode: NodeInputMode;
    prompt?: {
        text: string;
        callback: Function;
    };
}

export const LogReducer = (state: LogReducerState = initialState, action: LogAction) => {
    switch(action.type) {
        case LogActionType.AddMessage:
            return Object.assign({}, state, { messages: [ ...state.messages, action.message ] });
        case LogActionType.SetInputMode:
            return Object.assign({}, state, { input_mode: action.mode });
        case LogActionType.SetPrompt:
            return Object.assign({}, state, { prompt: { text: action.text, callback: action.callback }});
        case LogActionType.ResolvePrompt:
            return Object.assign({}, state, { prompt: undefined });
        case LogActionType.ClearMessages:
            return Object.assign({}, state, { messages: [] });
        default:
            return state;
    }
}