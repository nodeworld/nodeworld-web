import * as io from "socket.io-client";

import { Node } from "../models/node.model";
import { Message, MessageType } from "../models/message.model";
import { Visitor } from "../models/visitor.model";
import { Command } from "../models/command.model";
import { API_Error } from "../models/server.models";
import { manageLiveNodeConnection } from "../utils/live.utils";
import { store } from "../store";

declare const API_ENDPOINT: string;
declare const LIVE_ENDPOINT: string;

export const getNode = async (name: string): Promise<Node> => {
    const data = await fetch(`${API_ENDPOINT}/nodes?name=${name}&limit=1`);
    if(!data.ok) throw await data.json() as API_Error;
    const list = await data.json();
    return list.nodes[0];
}

export const joinNode = (name: string): void => {
    if(!(store.getState() as any).visitor.visitor) return;
    const socket = io(LIVE_ENDPOINT, { path: "/live", query: { node: name }});
    socket.on("connect", () => manageLiveNodeConnection(socket, store.dispatch));
}

export const sendMessage = async (node_id: string, type: MessageType, content: string): Promise<Message> => {
    const data = await fetch(`${API_ENDPOINT}/nodes/${node_id}/log`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, content })
    });
    if(!data.ok) throw await data.json() as API_Error;
    return await data.json();
}

export const runCommand = async (node_id: string, command: Command): Promise<null> => {
    const data = await fetch(`${API_ENDPOINT}/nodes/${node_id}/log/command`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: command.name, content: command.args.join(" ") })
    });
    if(!data.ok) throw await data.json() as API_Error;
    return null;
}

export const getMessages = async (node_name: string): Promise<Message[]> => {
    const data = await fetch(`${API_ENDPOINT}/nodes/${node_name}/log`);
    if(!data.ok) throw await data.json() as API_Error;
    const list = await data.json();
    return list.messages;
}