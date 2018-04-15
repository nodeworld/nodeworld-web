import * as React from "react";

import { hot } from "react-hot-loader";
import { Provider } from "react-redux";
import { Route, Switch } from "react-router-dom";

import * as VisitorActions from "./actions/visitor.actions";

import { store } from "./store";
import { NodeContainer } from "./components/node/node-container";

class App extends React.Component {
    componentDidMount() {
        store.dispatch(VisitorActions.setLoggedInVisitor());
    }
    
    render() {
        return (
            <Provider store={store}>
                <Switch>
                    <Route path="/:node([^\d]\w+)?" component={NodeContainer}/>
                </Switch>
            </Provider>
        );
    }
};

export default hot(module)(App);