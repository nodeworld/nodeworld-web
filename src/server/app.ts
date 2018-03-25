import * as express from "express";
import * as webpack from "webpack";
import * as devMiddleware from "webpack-dev-middleware";
import * as hotMiddleware from "webpack-hot-middleware";

import { resolve } from "path";

import * as SSR from "./middlewares/ssr";

const PRODUCTION = process.env.NODE_ENV === "production";

// Create application
const app = express();

// Web middleware
if(PRODUCTION) {
    app.use("/dist", express.static(resolve(__dirname, "../../dist")));
} else {
    const devCompiler = webpack(require("../../webpack/webpack.config.dev"));
    app.use(devMiddleware(devCompiler, { publicPath: "/dist" }));
    app.use(hotMiddleware(devCompiler));
}

app.get("*", PRODUCTION ? SSR.renderProdPage : SSR.renderDevPage);

// Export application
export { app };