import { WebVisitor } from "../models/visitor.model";
import { LoginData } from "../models/auth.model";

import { mapVisitorToWeb } from "../utils/mapping.utils";
declare const API_ENDPOINT: string;

export const register = async (login: LoginData): Promise<WebVisitor> => {
    const data = await fetch(`${API_ENDPOINT}/visitors`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(login)
    });
    const response = await data.json();
    return mapVisitorToWeb(response);
}

export const login = async (login: LoginData): Promise<WebVisitor> => {
    const data = await fetch(`${API_ENDPOINT}/visitors/login`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(login)
    });
    const response = await data.json();
    return mapVisitorToWeb(response);
}

export const logout = async (): Promise<null> => {
    const data = await fetch(`${API_ENDPOINT}/visitors/logout`, { credentials: "same-origin" });
    return null;
}

export const me = async (): Promise<WebVisitor> => {
    const data = await fetch(`${API_ENDPOINT}/visitors/me`, {
        credentials: "include"
    });
    const response = await data.json();
    return mapVisitorToWeb(response);
}