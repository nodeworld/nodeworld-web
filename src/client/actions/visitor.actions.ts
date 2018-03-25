import { Map } from "immutable";

import * as VisitorAPI from "../api/visitor.api";

import { WebVisitor } from "../models/visitor.model";

export enum VisitorActionType {
    SetVisitor = "SET_VISITOR",
    SetVisitorLogged = "SET_VISITOR_LOGGED",
    SetVisitorError = "SET_VISITOR_ERROR"
}

export type VisitorAction = SetVisitorAction | SetVisitorLoggedAction | SetVisitorErrorAction;

export interface SetVisitorAction {
    type: VisitorActionType.SetVisitor,
    visitor: WebVisitor | null
}

export interface SetVisitorLoggedAction {
    type: VisitorActionType.SetVisitorLogged,
    logged: boolean;
}

export interface SetVisitorErrorAction {
    type: VisitorActionType.SetVisitorError,
    message: string
}

export const setVisitor = (visitor: WebVisitor | null): SetVisitorAction => ({
    type: VisitorActionType.SetVisitor,
    visitor
});

export const setVisitorLogged = (logged: boolean): SetVisitorLoggedAction => ({
    type: VisitorActionType.SetVisitorLogged,
    logged
});

export const SetVisitorError = (message: string): SetVisitorErrorAction => ({
    type: VisitorActionType.SetVisitorError,
    message
});

export const setLoggedInVisitor = () => {
    return async (dispatch: Function) => {
        try {
            const visitor = await VisitorAPI.me();
            if(visitor.hasOwnProperty('errors')) throw (visitor as any)['errors'];
            await dispatch(setVisitor(visitor));
            await dispatch(setVisitorLogged(true));
        } catch(e) {
            dispatch(SetVisitorError(String(e)));
        }
    }
}

export const logOutVisitor = () => {
    return async (dispatch: Function) => {
        try {
            await VisitorAPI.logout();
            await dispatch(setVisitor(null));
            await dispatch(setVisitorLogged(false));
        } catch(e) {
            dispatch(SetVisitorError(String(e)));
        }
    }
}