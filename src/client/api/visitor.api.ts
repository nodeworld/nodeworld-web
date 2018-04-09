import { Visitor } from "../models/visitor.model";
import { LoginData } from "../models/auth.model";
import { API_Error } from "../models/server.models";

declare const API_ENDPOINT: string;

export const register = async (login: LoginData): Promise<Visitor> => {
    const data = await fetch(`${API_ENDPOINT}/visitors`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(login)
    });
    if(!data.ok) throw await data.json() as API_Error;
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
    if(!data.ok) throw await data.json() as API_Error;
    return await data.json();
}

export const logout = async (): Promise<null> => {
    const data = await fetch(`${API_ENDPOINT}/visitors/logout`, { credentials: "include" });
    if(!data.ok) throw await data.json();
    return null;
}

export const me = async (): Promise<Visitor> => {
    const data = await fetch(`${API_ENDPOINT}/visitors/me`, {
        credentials: "include"
    });
    if(!data.ok) throw await data.json() as API_Error;
    return await data.json();
}