import { v1 as uuidv1 } from "uuid";

export enum MessageType {
    SYSTEM = 0,
    CHAT = 1,
    ACTION = 2
}

export interface Message {
    id: string;
    author_id: string | null;
    type: MessageType;
    name: string | null;
    content: string;
    sent_at: string;
}

export const buildMessage = (data: Partial<Message>): Message => ({
    id: data.id ? data.id : uuidv1(),
    author_id: data.author_id ? data.author_id : null,
    type: data.type ? data.type : MessageType.SYSTEM,
    name: data.name ? data.name : null,
    content: data.content ? data.content : "",
    sent_at: data.sent_at ? data.sent_at : new Date().toISOString()
});