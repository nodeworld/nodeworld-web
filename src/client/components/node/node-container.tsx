import * as React from "react";

import { connect } from "react-redux";
import { Map } from "immutable";

import * as LogActions from "../../actions/log.actions";
import * as NodeActions from "../../actions/node.actions";

import { NodeLog } from "./node-log";
import { NodeInput } from "./node-input";
import { NodeMessage } from "./node-message";

import { WebMessage, MessageType } from "../../models/message.model"; 

const mapStateToProps = (state: any) => ({
    node: state.node,
    messages: state.log.messages,
    visitor: state.visitor
});

const mapDispatchToProps = (dispatch: any) => ({
    sendMessage: (type: MessageType, content: string) => dispatch(LogActions.sendMessage(type, content)),
    sendCommand: (content: string) => dispatch(LogActions.sendCommand(content)),
    getMessages: () => dispatch(LogActions.addRecentMessages()),
    sendGreeting: () => dispatch(LogActions.sendNodeGreeting()),
    getNode: (name: string) => dispatch(NodeActions.joinNode(name))
});

class NodeContainer extends React.Component {
    constructor(props: any) {
        super(props);
        this.resolveMessage = this.resolveMessage.bind(this);
    }

    async componentWillUpdate(nextProps: any) {
        if(nextProps.node && nextProps.node !== (this.props as any).node) {
            const node = nextProps.node;
            const { sendGreeting, getMessages } = this.props as any;
            await getMessages();
            await sendGreeting();
        }
    }

    componentDidMount() {
        const nodeName = (this.props as any).match.params.node
        const pathName = (this.props as any).location.pathname;
        if((!nodeName && pathName !== "/") || nodeName === "main")
            (this.props as any).history.push("/");
        const { getNode } = this.props as any;
        getNode(nodeName ? nodeName : "main");
    }

    async resolveMessage(message: string) {
        const { sendMessage, sendCommand } = this.props as any;
        if(message.charAt(0) === "/")
            await sendCommand(message);
        else
            await sendMessage(MessageType.CHAT, message);
    }

    render() {
        const { messages, visitor } = this.props as any;
        const visitor_name = visitor.logged ? visitor.visitor.name : null;
        return (
            <div className="node-room">
                <NodeLog messages={messages}/>
                <NodeInput onMessageSent={this.resolveMessage} visitor={visitor_name} />
            </div>
        );
    }
}

const MappedNodeContainer = connect(mapStateToProps, mapDispatchToProps)(NodeContainer as any);

export { MappedNodeContainer as NodeContainer };