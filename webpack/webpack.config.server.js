const webpack = require("webpack");
const path = require("path");

const AddModuleExportsPlugin = require("add-module-exports-webpack-plugin");

module.exports = {
    mode: "production",
    context: path.resolve(__dirname, "../src/client"),
    entry: ["babel-polyfill", "./app.tsx"],
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
    }
}