import { v4 as uuidv4 } from "uuid";

import { addMessage } from "../actions/log.actions";
import { MessageType, buildMessage, Message } from "../models/message.model";

import { store } from "../store";

export const manageLiveNodeConnection = (socket: SocketIOClient.Socket, dispatch: Function) => {
    socket.on("message", (message: Message) => {
        if(message.author_id === (store.getState() as any).visitor.visitor.id) return;
        dispatch(addMessage(buildMessage(message)));
    });
}