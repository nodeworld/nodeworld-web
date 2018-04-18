import { VisitorAction, VisitorActionType } from "../actions/visitor.actions";
import { Visitor } from "../models/visitor.model";

const initialState = { logged: false, visitor: null };

export interface VisitorReducerState {
    visitor: Visitor | null
}

export const VisitorReducer = (state: VisitorReducerState = initialState, action: VisitorAction) => {
    switch(action.type) {
        case VisitorActionType.SetVisitor:
            return Object.assign({}, state, { visitor: action.visitor });
        default:
            return state;
    }
}