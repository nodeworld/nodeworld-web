import * as React from "react";

import { Request, Response, NextFunction } from "express";
import { genHtml } from "../utils/gen-html";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router";

const App = require("../../../dist/client.bundle.js").default;

export const renderDevPage = (req: Request, res: Response, next: NextFunction) => {
    const html = genHtml();
    res.send(html);
}

export const renderProdPage = (req: Request, res: Response, next: NextFunction) => {
    const app = (
        <StaticRouter location={req.url}>
            <App/>
        </StaticRouter>
    )
    const markup = renderToString(app);
    res.send(genHtml(markup));
}