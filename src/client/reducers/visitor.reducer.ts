import { VisitorAction, VisitorActionType } from "../actions/visitor.actions";
import { WebVisitor } from "../models/visitor.model";

const initialState = { logged: false, visitor: null };

export interface VisitorReducerState {
    logged: boolean;
    visitor: WebVisitor | null
}

export const VisitorReducer = (state: VisitorReducerState, action: VisitorAction) => {
    switch(action.type) {
        case VisitorActionType.SetVisitor:
            return Object.assign({}, state, { visitor: action.visitor });
        case VisitorActionType.SetVisitorLogged:
            return Object.assign({}, state, { logged: action.logged });
        case VisitorActionType.SetVisitorError:
            console.error(action.message);
            return initialState;
        default:
            return state ? state : initialState;
    }
}