import * as React from "react";

import { RegisterForm } from "./register-form";

import { register } from "../../api/visitor.api";
import { LoginData } from "../../models/auth.model";

class RegisterPage extends React.Component {
    constructor(props: any) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
    }

    async onSubmit(data: LoginData) {
        try {
            const visitor = await register(data);
            (this.props as any).history.push("/");
        } catch(e) {
            console.error(e);
        }
    }

    render() {
        return (
            <div className="node-page">
                <h5 className="node-page-title">register</h5>
                <RegisterForm onSubmit={this.onSubmit}/>
            </div>
        );
    }
}

export { RegisterPage };