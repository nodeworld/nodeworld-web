import * as React from "react";

import { Link } from "react-router-dom";

import { MessageType } from "../../models/message.model";

export interface NodeInputProps {
    onMessageSent: Function,
    visitor: string
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
        const { visitor } = this.props;
        return (
            <div className="node-input-container">
                { visitor ? (
                    <React.Fragment>
                        <div className="node-input-status">{ visitor }</div>
                        <form onSubmit={this.submit}>
                            <input value={(this.state as any).message} onChange={this.onChange} type="text"></input>
                        </form>
                    </React.Fragment>
                ) : (
                    <div className="node-input-status">Log in at <Link to="/login">/login</Link> or register at <Link to="/register">/register</Link></div>
                )}
            </div>
        );
    }
}

export { NodeInput };