import * as React from "react";

import { connect } from "react-redux";

import { LoginForm } from "./login-form";

import { setVisitor, setVisitorLogged } from "../../actions/visitor.actions";
import { login } from "../../api/visitor.api";
import { LoginData } from "../../models/auth.model";
import { Visitor } from "../../models/visitor.model";

const mapDispatchToProps = (dispatch: any) => ({
    setVisitor: (visitor: Visitor) => dispatch(setVisitor(visitor)),
    setVisitorLogged: (logged: boolean) => dispatch(setVisitorLogged(logged))
});

const mapStateToProps = (state: any) => ({
    visitor: state.visitor
});

export interface LoginPageState {
    visitor: { logged: boolean, visitor: Visitor | null }
}

class LoginPage extends React.Component<LoginPageState> {
    constructor(props: any) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentWillMount() {
        if(this.props.visitor.logged)
            (this.props as any).history.goBack();
    }

    async onSubmit(data: LoginData) {
        try {
            const { setVisitor, setVisitorLogged } = this.props as any;
            const visitor = await login(data);
            await setVisitor(visitor);
            await setVisitorLogged(true);
            (this.props as any).history.goBack();
        } catch(e) {
            console.error(e);
        }
    }

    render() {
        return (
            <div className="node-page">
                <h5 className="node-page-title">log in</h5>
                <LoginForm onSubmit={this.onSubmit}/>
            </div>
        );
    }
}

const MappedLoginPage = connect(mapStateToProps, mapDispatchToProps)(LoginPage as any);

export { MappedLoginPage as LoginPage };