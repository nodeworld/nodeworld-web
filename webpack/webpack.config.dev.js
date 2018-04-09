const webpack = require("webpack");
const path = require("path");

module.exports = {
    mode: "development",
    context: path.resolve(__dirname, "../src/client"),
    entry: [
        "babel-polyfill",
        "webpack-hot-middleware/client",
        "./main.tsx"
    ],
    devtool: "inline-source-map",
    output: {
        path: path.resolve(__dirname, "../dist"),
        filename: "[name].bundle.js"
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"]
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: ["babel-loader", "ts-loader"]
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            }
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin({
            API_ENDPOINT: JSON.stringify(process.env.API_ENDPOINT) || JSON.stringify("api.nodeworld.io"),
            LIVE_ENDPOINT: JSON.stringify(process.env.LIVE_ENDPOINT) || JSON.stringify("live.nodeworld.io")
        })
    ]
}