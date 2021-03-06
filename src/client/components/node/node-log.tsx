import * as React from "react";

import { connect } from "react-redux";

import { Message } from "../../models/message.model";
import { NodeMessage } from "./node-message";

export interface NodeLogProps {
    messages: Array<Message>;
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
        const message_list = messages && messages.map((message:Message) => 
            <NodeMessage
            key={message.id}
            type={message.type}
            author={message.author_id}
            name={message.name}
            content={message.content}
            sent_at={message.sent_at}/>
        );
        return (
            <div className="node-log" ref={e => this.log = e}>
                <ul>{message_list}</ul>
            </div>
        );
    }
}

export { NodeLog };