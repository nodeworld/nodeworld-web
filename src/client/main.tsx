import * as React from "react";

import { render } from "react-dom";
import { BrowserRouter } from "react-router-dom";

import "./css/normalize.css";
import "./css/nodeworld.css";

import App from "./app";

declare const API_ENDPOINT: string;

class AppContainer extends React.Component {
    render() {
        return (
            <BrowserRouter>
                <App/>
            </BrowserRouter>
        );
    }
}

if(typeof window !== 'undefined')
    render(<AppContainer />, document.getElementById("root"));