import * as React from "react";

export interface RegisterFormProps {
    onSubmit: Function;
}

export interface RegisterFormState {
    name: string;
    password: string;
    email: string;
}

class RegisterForm extends React.Component<RegisterFormProps, RegisterFormState> {
    constructor(props: any) {
        super(props);
        this.state = { name: "", password: "", email: "" };
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
                <input className="node-form-input" name="email" type="email" placeholder="email address" value={this.state.email} onChange={this.handleChange}/>
                <button className="node-form-input" type="submit">register</button>
            </form>
        );
    }
}

export { RegisterForm };