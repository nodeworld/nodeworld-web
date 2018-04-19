import * as io from "socket.io-client";

import { Action } from "redux";

import { Node } from "../models/node.model";
import { Message, MessageType, buildMessage } from "../models/message.model";
import { Visitor } from "../models/visitor.model";
import { Command } from "../models/command.model";
import { manageLiveNodeConnection } from "../utils/live.utils";
import { handleError } from "../utils/api.utils";
import { store } from "../store";

declare const API_ENDPOINT: string;
declare const LIVE_ENDPOINT: string;

//let socket = io(LIVE_ENDPOINT, { autoConnect: false, path: "/", reconnectionAttempts: 3 });
//manageLiveNodeConnection(socket, (a: Action) => store.dispatch(a));
let socket: SocketIOClient.Socket;

export const getNode = async (name: string): Promise<Node> => {
    const data = await fetch(`${API_ENDPOINT}/nodes?name=${name}&limit=1`);
    await handleError(data);
    const list = await data.json();
    return list.nodes[0];
}

export const leaveNode = () => {
    if(socket && socket.connected)
        socket.close();
}

// TODO: Scold socket.io devs for wasting hours of my sleep just to end up implementing a hacky solution to an easily-fixable problem
export const joinNode = (name: string): void => {
    socket = io(`${LIVE_ENDPOINT}/${name}`, { path: "/", reconnectionAttempts: 3 });
    socket.on("connect", () => {
        socket.removeAllListeners();
        manageLiveNodeConnection(socket, (a: Action) => store.dispatch(a));
    });
}

export const sendMessage = async (node_id: string, type: MessageType, content: string): Promise<Message> => {
    const data = await fetch(`${API_ENDPOINT}/nodes/${node_id}/log`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, content })
    });
    await handleError(data);
    return await data.json();
}

export const runCommand = async (node_id: string, command: Command): Promise<null> => {
    const data = await fetch(`${API_ENDPOINT}/nodes/${node_id}/log/command`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: command.name, content: command.args.join(" ") })
    });
    await handleError(data);
    return null;
}

export const getMessages = async (node_name: string): Promise<Message[]> => {
    const data = await fetch(`${API_ENDPOINT}/nodes/${node_name}/log`);
    await handleError(data);
    const list = await data.json();
    return list.messages;
}