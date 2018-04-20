const webpack = require("webpack");
const path = require("path");

require("dotenv").config();

const AddModuleExportsPlugin = require("add-module-exports-webpack-plugin");

module.exports = {
    mode: "production",
    context: path.resolve(__dirname, "../src/client"),
    entry: ["babel-polyfill", "./store.ts", "./app.tsx"],
    target: "node",
    output: {
        path: path.resolve(__dirname, "../dist"),
        filename: "client.bundle.js",
        libraryTarget: "commonjs2"
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"]
    },
    plugins: [
        new AddModuleExportsPlugin()
    ],
    module: {
        rules: [
            { test: /\.tsx?$/, loader: "ts-loader" }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            API_ENDPOINT: JSON.stringify(process.env.API_ENDPOINT) || JSON.stringify("api.nodeworld.io"),
            LIVE_ENDPOINT: JSON.stringify(process.env.LIVE_ENDPOINT) || JSON.stringify("live.nodeworld.io")
        })
    ]
}