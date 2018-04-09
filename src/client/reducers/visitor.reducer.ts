import { VisitorAction, VisitorActionType } from "../actions/visitor.actions";
import { Visitor } from "../models/visitor.model";

const initialState = { logged: false, visitor: null };

export interface VisitorReducerState {
    logged: boolean;
    visitor: Visitor | null
}

export const VisitorReducer = (state: VisitorReducerState, action: VisitorAction) => {
    switch(action.type) {
        case VisitorActionType.SetVisitor:
            return Object.assign({}, state, { visitor: action.visitor });
        case VisitorActionType.SetVisitorLogged:
            return Object.assign({}, state, { logged: action.logged });
        default:
            return state ? state : initialState;
    }
}