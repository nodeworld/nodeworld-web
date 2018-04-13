import { Map } from "immutable";

import * as VisitorAPI from "../api/visitor.api";

import { Visitor } from "../models/visitor.model";

export enum VisitorActionType {
    SetVisitor = "SET_VISITOR",
    SetVisitorLogged = "SET_VISITOR_LOGGED",
    SetVisitorError = "SET_VISITOR_ERROR"
}

export type VisitorAction = SetVisitorAction | SetVisitorLoggedAction;

export interface SetVisitorAction {
    type: VisitorActionType.SetVisitor,
    visitor: Visitor | null
}

export interface SetVisitorLoggedAction {
    type: VisitorActionType.SetVisitorLogged,
    logged: boolean;
}

export const setVisitor = (visitor: Visitor | null): SetVisitorAction => ({
    type: VisitorActionType.SetVisitor,
    visitor
});

export const setVisitorLogged = (logged: boolean): SetVisitorLoggedAction => ({
    type: VisitorActionType.SetVisitorLogged,
    logged
});

export const setLoggedInVisitor = () => {
    return async (dispatch: Function) => {
        try {
            const visitor = await VisitorAPI.me();
            if(visitor.hasOwnProperty('errors')) throw (visitor as any)['errors'];
            await dispatch(setVisitor(visitor));
            await dispatch(setVisitorLogged(true));
        } catch(e) { console.error(e); }
    }
}

export const logOutVisitor = () => {
    return async (dispatch: Function) => {
        try {
            await VisitorAPI.logout();
            await dispatch(setVisitorLogged(false));
            await dispatch(setVisitor(null));
        } catch(e) { console.error(e); }
    }
}