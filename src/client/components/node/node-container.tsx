import * as React from "react";

import { connect } from "react-redux";
import { Map } from "immutable";

import * as LogActions from "../../actions/log.actions";
import * as NodeActions from "../../actions/node.actions";

import { NodeLog } from "./node-log";
import { NodeInput, NodeInputMode } from "./node-input";
import { NodeMessage } from "./node-message";

import { buildMessage, MessageType, Message } from "../../models/message.model";
import { VisitorReducerState } from "../../reducers/visitor.reducer";
import { NodeReducerState } from "../../reducers/node.reducer";
import { CombinedReducerState } from "../../reducers";

const mapStateToProps = (state: CombinedReducerState) => ({
    node: state.node,
    input_mode: state.log.input_mode,
    prompt: state.log.prompt,
    messages: state.log.messages,
    visitor: state.visitor
});

const mapDispatchToProps = (dispatch: any) => ({
    systemMessage: (content: string) => dispatch(LogActions.addMessage(buildMessage({ type: MessageType.SYSTEM, content }))),
    sendMessage: (type: MessageType, content: string) => dispatch(LogActions.sendMessage(type, content)),
    sendCommand: (content: string) => dispatch(LogActions.sendCommand(content)),
    resolvePrompt: () => dispatch(LogActions.resolvePrompt()),
    joinNode: (name: string) => dispatch(NodeActions.joinNode(name))
});

export interface NodeContainerProps {
    sendMessage: (type: MessageType, content: string) => void;
    sendCommand: (content: string) => void;
    joinNode: (name: string) => void;
    resolvePrompt: () => void;
    systemMessage: (content: string) => void;
    messages: Message[];
    visitor: VisitorReducerState;
    node: NodeReducerState,
    input_mode: NodeInputMode,
    prompt?: { text: string, callback: Function }
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
        const { sendMessage, sendCommand, systemMessage, prompt, resolvePrompt } = this.props;
        if(message.charAt(0) === "/") {
            await sendCommand(message);
        } else {
            if(prompt) {
                await prompt.callback(message);
                await resolvePrompt();
            } else if(this.props.node.node) {
                await sendMessage(MessageType.CHAT, message);
            } else {
                await systemMessage("You are currently in space. To join a node, type /join [node]");
            }
        }
    }

    render() {
        const { messages, visitor, input_mode, prompt } = this.props;
        const visitor_name = visitor.visitor ? visitor.visitor.name : undefined;
        const prompt_text = prompt ? prompt.text : undefined;
        return (
            <div className="node-room">
                <NodeLog messages={messages}/>
                <NodeInput onMessageSent={this.resolveMessage} name={visitor_name} mode={input_mode} prompt={prompt_text} />
            </div>
        );
    }
}

const MappedNodeContainer = connect(mapStateToProps, mapDispatchToProps)(NodeContainer as any);

export { MappedNodeContainer as NodeContainer };