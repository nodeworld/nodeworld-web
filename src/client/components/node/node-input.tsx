import * as React from "react";

import { Link } from "react-router-dom";

import { MessageType } from "../../models/message.model";

export enum NodeInputMode {
    ANONYMOUS = 0,
    CHAT = 1,
}

export interface NodeInputProps {
    onMessageSent: Function,
    mode: NodeInputMode
    name: string | null
}

class NodeInput extends React.Component<NodeInputProps, {}> {
    constructor(props: any) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.submit = this.submit.bind(this);
        this.state = {message: ""};
    }

    onChange(e: any) {
        this.setState({ message: e.target.value });
    }

    submit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const { message } = this.state as any;
        this.props.onMessageSent(message);
        this.setState({ message: "" });
    }

    render() {
        const { name, mode } = this.props;
        switch(mode) {
            case NodeInputMode.ANONYMOUS:
                return (
                    <div className="node-input-container">
                        <div className="node-input-status">anonymous</div>
                        <form onSubmit={this.submit}>
                            <input value={(this.state as any).message} placeholder="/register [name] or /login [name]" onChange={this.onChange} type="text"></input>
                        </form>
                    </div>
                );
            case NodeInputMode.CHAT:
                return (
                    <div className="node-input-container">
                        <React.Fragment>
                            <div className="node-input-status">{ name }</div>
                            <form onSubmit={this.submit}>
                                <input value={(this.state as any).message} onChange={this.onChange} type="text"></input>
                            </form>
                        </React.Fragment>
                    </div>
                );
        }
    }
}

export { NodeInput };