import * as React from "react";

import { connect } from "react-redux";

import { Message } from "../../models/message.model";
import { NodeMessage } from "./node-message";

export interface NodeLogProps {
    messages: Array<Message>;
}

export const shouldMessageShowMeta = (prevMsg: Message, currMsg: Message): boolean => {
    if(prevMsg.name === currMsg.name && prevMsg.type === currMsg.type) {
        const delta = Math.abs(new Date(prevMsg.sent_at).getMilliseconds() - new Date(currMsg.sent_at).getMilliseconds());
        if(delta > 300000)  // 5 minutes
            return true;
        else
            return false;
    } else {
        return true;
    }
}

class NodeLog extends React.Component<NodeLogProps, {}> {
    private log: HTMLDivElement | null;

    constructor(props: NodeLogProps) {
        super(props);
    }

    componentDidUpdate(prevProps: NodeLogProps) {
        if(this.props.messages.length > prevProps.messages.length && this.log) {
            this.log.scrollTop = this.log.scrollHeight;
        }
    }

    render() {
        const { messages } = this.props;
        let alt_color = false;
        const message_list = messages && messages.map((message: Message, i: number) => {
            const show_meta = i === 0 ? true : shouldMessageShowMeta(messages[i-1], message);
            if(show_meta) alt_color = !alt_color;
            return (
                <NodeMessage
                key={message.id}
                type={message.type}
                author={message.author_id}
                name={message.name}
                content={message.content}
                sent_at={message.sent_at}
                show_meta={show_meta}
                alt_color={alt_color}
                />
            );
        });
        return (
            <div className="node-log" ref={e => this.log = e}>
                <ul>{message_list}</ul>
            </div>
        );
    }
}

export { NodeLog };