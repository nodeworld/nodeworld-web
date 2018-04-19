import * as VisitorAPI from "../api/visitor.api";

import { printSystemMessage } from "./log.actions";
import { Visitor } from "../models/visitor.model";
import { MessageType } from "../models/message.model";

export enum VisitorActionType {
    SetVisitor = "SET_VISITOR"
}

export type VisitorAction = SetVisitorAction;

export interface SetVisitorAction {
    type: VisitorActionType.SetVisitor,
    visitor?: Visitor
}

export const setVisitor = (visitor?: Visitor): SetVisitorAction => ({
    type: VisitorActionType.SetVisitor,
    visitor
});

export const setLoggedInVisitor = () => {
    return async (dispatch: Function) => {
        try {
            const visitor = await VisitorAPI.me();
            await dispatch(setVisitor(visitor));
        } catch(e) { }
    }
}

export const logOutVisitor = () => {
    return async (dispatch: Function) => {
        try {
            await VisitorAPI.logout();
            await dispatch(setVisitor());
        } catch(e) { dispatch(printSystemMessage(`Error: ${e.message}`)); }
    }
}