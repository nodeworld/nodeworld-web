import { WebNode, ServerNode } from "../models/node.model";
import { ServerMessage, MessageType, WebMessage } from "../models/message.model";
import { WebVisitor, ServerVisitor } from "../models/visitor.model";

import { mapNodeToWeb } from "../utils/mapping.utils";
import { mapMessageToWeb } from "../utils/mapping.utils";
import { Command } from "../models/command.model";

declare const API_ENDPOINT: string;

export const getNode = async (name: string): Promise<WebNode> => {
    const data = await fetch(`${API_ENDPOINT}/nodes?name=${name}&limit=1`);
    if(!data.ok) throw data.statusText;
    const list = await data.json();
    return mapNodeToWeb(list.nodes[0]);
}

export const sendMessage = async (node_id: string, type: MessageType, content: string): Promise<WebMessage> => {
    const data = await fetch(`${API_ENDPOINT}/nodes/${node_id}/log`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, content })
    });
    if(!data.ok) throw data.statusText;
    const response = await data.json();
    return mapMessageToWeb(response);
}

export const runCommand = async (node_id: string, command: Command): Promise<null> => {
    const data = await fetch(`${API_ENDPOINT}/nodes/${node_id}/log/command`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: command.name, content: command.args.join(" ") })
    });
    if(!data.ok) throw data.statusText;
    return null;
}

export const getMessages = async (node_name: string): Promise<WebMessage[]> => {
    const data = await fetch(`${API_ENDPOINT}/nodes/${node_name}/log`);
    if(!data.ok) throw data.statusText;
    const list = await data.json();
    list.messages.map(mapMessageToWeb);
    return list.messages;
}