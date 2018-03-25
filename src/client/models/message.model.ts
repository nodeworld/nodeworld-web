export enum MessageType {
    SYSTEM = 0,
    CHAT = 1,
    ACTION = 2
}

export interface Message {
    type: MessageType;
    name: string;
    content: string;
    sent_at: string;
}

export interface ServerMessage extends Message {
    message_id: string;
    author_id: string;
}

export interface WebMessage extends Message {
    id: string;
    author: string;
}