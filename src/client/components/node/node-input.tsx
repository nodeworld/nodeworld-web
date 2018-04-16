import * as React from "react";

import { Link } from "react-router-dom";

import { MessageType } from "../../models/message.model";

export enum NodeInputMode {
    CHAT = 0,
    SECURE = 1
}

export interface NodeInputProps {
    onMessageSent: Function;
    mode: NodeInputMode;
    name?: string;
    prompt?: string;
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
        const { name, mode, prompt } = this.props;
        switch(mode) {
            case NodeInputMode.CHAT:
                return (
                    <div className="node-input-container">
                        <React.Fragment>
                            <div className="node-input-status">{ name ? name : "anonymous" }</div>
                            <form onSubmit={this.submit}>
                                <input value={(this.state as any).message} placeholder={ prompt } onChange={this.onChange} type="text"></input>
                            </form>
                        </React.Fragment>
                    </div>
                );
            case NodeInputMode.SECURE:
                return (
                    <div className="node-input-container">
                        <React.Fragment>
                            <div className="node-input-status">secure</div>
                            <form onSubmit={this.submit}>
                                <input value={(this.state as any).message} placeholder={ prompt } onChange={this.onChange} type="password"></input>
                            </form>
                        </React.Fragment>
                    </div>
                );
        }
    }
}

export { NodeInput };