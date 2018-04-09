import { LogAction, LogActionType } from "../actions/log.actions";
import { Message } from "../models/message.model";

const initialState = { messages: [] };

export interface LogReducerState {
    messages: Array<Message>;
}

export const LogReducer = (state: LogReducerState, action: LogAction) => {
    switch(action.type) {
        case LogActionType.AddMessage:
            return Object.assign({}, state, { messages: [ ...state.messages, action.message ] });
        case LogActionType.ClearMessages:
            return initialState;
        default:
            return state ? state : initialState;
    }
}