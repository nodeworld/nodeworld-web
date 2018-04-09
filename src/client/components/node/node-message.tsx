import * as React from "react";
import * as moment from "moment";

import { MessageType } from "../../models/message.model";

export interface NodeMessageProps {
    type: MessageType;
    author: string | null;
    name: string | null;
    content: string;
    sent_at: string;
}

const renderMessage = (type: MessageType, name: string | null, content: string, sent_at?: string) => {
    const timestamp = <span className="node-message-timestamp">{moment(sent_at).format("h:mm A")}</span>;
    const display_name = name ? <strong className="node-message-author">{name}</strong> : null;
    const cont = <span className="node-message-content">{content}</span>;
    switch(type) {
        case MessageType.SYSTEM:
            return (
                <li className="node-message node-message-system">
                    {timestamp}{cont}
                </li>
            );
        case MessageType.CHAT:
            return (
                <li className="node-message node-message-chat">
                    {timestamp}{display_name}{cont}
                </li>
            );
        case MessageType.ACTION:
            return (
                <li className="node-message node-message-action">
                    {timestamp}{display_name}{cont}
                </li>
            );
        default:
            return null;
    }
}

export class NodeMessage extends React.Component<NodeMessageProps, {}> {
    render() {
        const { name, content, type, sent_at } = this.props;
        return renderMessage(type, name, content, sent_at);
    }
}