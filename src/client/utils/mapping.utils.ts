import { ServerMessage, WebMessage } from "../models/message.model";
import { ServerVisitor, WebVisitor } from "../models/visitor.model";
import { ServerNode, WebNode } from "../models/node.model";

export const mapMessageToWeb = (message: ServerMessage): WebMessage => ({
    id: message.message_id,
    type: message.type,
    author: message.author_id,
    name: message.name,
    content: message.content,
    sent_at: message.sent_at
});

export const mapVisitorToWeb = (visitor: ServerVisitor): WebVisitor => ({
    id: visitor.visitor_id,
    name: visitor.name,
    email: visitor.email
});

export const mapNodeToWeb = (node: ServerNode): WebNode => ({
    id: node.node_id,
    owner_id: node.owner_id,
    name: node.name,
    greeting: node.greeting
});