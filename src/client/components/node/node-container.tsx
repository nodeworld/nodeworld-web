import * as React from "react";

import { connect } from "react-redux";
import { Map } from "immutable";

import * as LogActions from "../../actions/log.actions";
import * as NodeActions from "../../actions/node.actions";

import { NodeLog } from "./node-log";
import { NodeInput } from "./node-input";
import { NodeMessage } from "./node-message";

import { buildMessage, MessageType, Message } from "../../models/message.model";
import { VisitorReducerState } from "../../reducers/visitor.reducer";
import { NodeReducerState } from "../../reducers/node.reducer";

const mapStateToProps = (state: any) => ({
    node: state.node,
    messages: state.log.messages,
    visitor: state.visitor
});

const mapDispatchToProps = (dispatch: any) => ({
    systemMessage: (content: string) => dispatch(LogActions.addMessage(buildMessage({ type: MessageType.SYSTEM, content }))),
    sendMessage: (type: MessageType, content: string) => dispatch(LogActions.sendMessage(type, content)),
    sendCommand: (content: string) => dispatch(LogActions.sendCommand(content)),
    joinNode: (name: string) => dispatch(NodeActions.joinNode(name))
});

export interface NodeContainerProps {
    sendMessage: (type: MessageType, content: string) => void;
    sendCommand: (content: string) => void;
    joinNode: (name: string) => void;
    systemMessage: (content: string) => void;
    messages: Message[];
    visitor: VisitorReducerState;
    node: NodeReducerState
}

class NodeContainer extends React.Component<NodeContainerProps> {
    constructor(props: any) {
        super(props);
        this.resolveMessage = this.resolveMessage.bind(this);
    }

    async componentDidMount() {
        const nodeName = (this.props as any).match.params.node;
        if(nodeName)
            this.props.joinNode(nodeName);
        else
            await this.props.systemMessage("You are currently in space. To join a node, type /join [node]");
    }

    async resolveMessage(message: string) {
        const { sendMessage, sendCommand, systemMessage } = this.props;
        if(message.charAt(0) === "/") {
            await sendCommand(message);
        } else {
            if(this.props.node.node) {
                await sendMessage(MessageType.CHAT, message);
            } else {
                await systemMessage("You are currently in space. To join a node, type /join [node]");
            }
        }
    }

    render() {
        const { messages, visitor } = this.props;
        const visitor_name = visitor.logged ? visitor.visitor!.name : null;
        return (
            <div className="node-room">
                <NodeLog messages={messages}/>
                <NodeInput onMessageSent={this.resolveMessage} name={visitor_name} />
            </div>
        );
    }
}

const MappedNodeContainer = connect(mapStateToProps, mapDispatchToProps)(NodeContainer as any);

export { MappedNodeContainer as NodeContainer };