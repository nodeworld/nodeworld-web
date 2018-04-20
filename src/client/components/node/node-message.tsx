import * as React from "react";
import * as moment from "moment";

import styled, { keyframes } from "styled-components";

import { MessageType } from "../../models/message.model";

const anim_slide = require("react-animations").slideInUp;
const AnimatedLi = styled.li`
    animation: 0.4s ${keyframes`${anim_slide}`};
`;

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
                <AnimatedLi className="node-message node-message-system">
                    {timestamp}{cont}
                </AnimatedLi>
            );
        case MessageType.CHAT:
            return (
                <AnimatedLi className="node-message node-message-chat">
                    {timestamp}{display_name}{cont}
                </AnimatedLi>
            );
        case MessageType.ACTION:
            return (
                <AnimatedLi className="node-message node-message-action">
                    {timestamp}{display_name}{cont}
                </AnimatedLi>
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