import * as React from "react";
import * as moment from "moment";
import * as classnames from "classnames";

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
    show_meta: boolean;
}

export class NodeMessage extends React.Component<NodeMessageProps, {}> {
    render() {
        const { name, content, type, sent_at, show_meta } = this.props;
        const timestamp = <span className={ classnames("node-message-timestamp", { hidden: !show_meta }) }>{moment(sent_at).format("h:mm A")}</span>;
        const display_name = name ? <span className={ classnames("node-message-author", { hidden: !show_meta }) }>{name}</span> : null;
        const cont = <div className="node-message-content">{content}</div>;
        const message_class = classnames("node-message", {
            "node-message-system": type === MessageType.SYSTEM,
            "node-message-chat": type === MessageType.CHAT,
            "node-message-action": type === MessageType.ACTION
        });
        
        return (
            <AnimatedLi className={message_class}>
                {timestamp}{display_name}{cont}
            </AnimatedLi>
        );
    }
}