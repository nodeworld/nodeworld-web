import { Visitor } from "../models/visitor.model";
import { LoginData } from "../models/auth.model";

import { handleError } from "../utils/api.utils";

declare const API_ENDPOINT: string;

export const getVisitor = async (name: string): Promise<Visitor> => {
    const data = await fetch(`${API_ENDPOINT}/visitors?name=${name}&limit=1`);
    await handleError(data);
    const list = (await data.json()).visitors;
    return list[0];
}

export const register = async (login: LoginData): Promise<{ visitor: Visitor, node: Node }> => {
    const data = await fetch(`${API_ENDPOINT}/visitors`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(login)
    });
    await handleError(data);
    return await data.json();
}

export const login = async (login: LoginData): Promise<Visitor> => {
    const data = await fetch(`${API_ENDPOINT}/visitors/login`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(login)
    });
    await(handleError(data));
    return await data.json();
}

export const logout = async (): Promise<null> => {
    const data = await fetch(`${API_ENDPOINT}/visitors/logout`, { credentials: "include" });
    await(handleError(data));
    return null;
}

export const me = async (): Promise<Visitor> => {
    const data = await fetch(`${API_ENDPOINT}/visitors/me`, {
        credentials: "include"
    });
    await(handleError(data));
    return await data.json();
}