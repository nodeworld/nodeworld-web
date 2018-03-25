const webpack = require("webpack");
const path = require("path");

const AddModuleExportsPlugin = require("add-module-exports-webpack-plugin");

const vendors = [
    "react",
    "react-dom"
];

module.exports = {
    mode: "production",
    context: path.resolve(__dirname, "../src/client"),
    entry: {
        main: "./main.tsx",
        vendor: vendors
    },
    output: {
        path: path.resolve(__dirname, "../dist"),
        filename: "[name].bundle.js",
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"]
    },
    module: {
        rules: [
            { test: /\.tsx?$/, loader: "ts-loader" },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            }
        ]
    }
}