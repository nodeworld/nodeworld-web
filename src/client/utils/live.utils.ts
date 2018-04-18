import { v4 as uuidv4 } from "uuid";

import { addMessage } from "../actions/log.actions";
import { MessageType, buildMessage, Message } from "../models/message.model";

import { store } from "../store";

export const manageLiveNodeConnection = (socket: SocketIOClient.Socket, dispatch: Function) => {
    const send = (message: Partial<Message>) => dispatch(addMessage(buildMessage(message)));

    socket.on("message", (message: Message) => {
        const visitor = store.getState().visitor.visitor;
        if(visitor && message.author_id === visitor.id) return;
        send(message);
    });

    socket.on("disconnect", (reason: any) => {
        const node = store.getState().node.node!.name;
        switch(reason) {
            case "io client disconnect":
                send({ type: MessageType.SYSTEM, content: `Left ${node}.` });
                break;
            default:
                send({ type: MessageType.SYSTEM, content: `Left ${node}. Attempting to reconnect...` });
        }
    });

    socket.on("connect_error", () => {
        send({ type: MessageType.SYSTEM, content: "Failed to join node." });
    });
    socket.on("reconnect_attempt", (count: number) => {
        send({ type: MessageType.SYSTEM, content: `Retrying... (Attempt #${count})` });
    });

    socket.on("error", (err: any) => {
        console.log(err);
    });
}