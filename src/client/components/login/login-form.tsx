import * as React from "react";

export interface LoginFormProps {
    onSubmit: Function;
}

export interface LoginFormState {
    name: string;
    password: string;
}

class LoginForm extends React.Component<LoginFormProps, LoginFormState> {
    constructor(props: any) {
        super(props);
        this.state = { name: "", password: "" };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e: any) {
        const name = e.target.name;
        this.setState({ [name]: e.target.value });
    }

    handleSubmit(e: any) {
        e.preventDefault();
        this.props.onSubmit(this.state);
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <input className="node-form-input" name="name" type="text" placeholder="name" required={true} value={this.state.name} onChange={this.handleChange}/>
                <input className="node-form-input" name="password" type="password" placeholder="password" required={true} value={this.state.password} onChange={this.handleChange}/>
                <button className="node-form-input" type="submit">log in</button>
            </form>
        );
    }
}

export { LoginForm };