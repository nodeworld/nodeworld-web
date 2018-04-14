import { v4 as uuidv4 } from "uuid";

import { addMessage } from "../actions/log.actions";
import { MessageType, buildMessage, Message } from "../models/message.model";

import { store } from "../store";

export const manageLiveNodeConnection = (socket: SocketIOClient.Socket, dispatch: Function) => {
    socket.on("message", (message: Message) => {
        const logged = store.getState().visitor.logged;
        if(logged && message.author_id === store.getState().visitor.visitor!.id) return;
        dispatch(addMessage(buildMessage(message)));
    });

    socket.on("disconnect", (reason: any) => {
        const node = store.getState().node.node!.name;
        dispatch(addMessage(buildMessage({ type: MessageType.SYSTEM, content: `Left ${node}. Attempting to reconnect...` })));
    });

    socket.on("error", (err: any) => {
        console.log(err);
    });
}