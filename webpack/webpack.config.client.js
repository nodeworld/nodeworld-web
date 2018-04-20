const webpack = require("webpack");
const path = require("path");

require("dotenv").config();

const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const ManifestPlugin = require("webpack-manifest-plugin");

const vendors = [
    "react",
    "react-dom",
    "react-router",
    "react-router-dom",
    "uuid",
    "react-redux",
    "redux",
    "moment",
    "socket.io-client"
];

module.exports = {
    mode: "production",
    context: path.resolve(__dirname, "../src/client"),
    entry: {
        main: [
            "./store.ts",
            "./main.tsx"
        ],
        vendor: vendors
    },
    output: {
        path: path.resolve(__dirname, "../dist"),
        filename: "[name]_[chunkhash].js",
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"]
    },
    module: {
        rules: [
            { test: /\.tsx?$/, loader: "ts-loader", options: { transpileOnly: true } },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            }
        ]
    },
    optimization: {
        splitChunks: {
            chunks: "all",
            name: "vendor",
            automaticNameDelimiter: "."
        }
    },
    plugins: [
        new webpack.DefinePlugin({
            API_ENDPOINT: JSON.stringify(process.env.API_ENDPOINT) || JSON.stringify("api.nodeworld.io"),
            LIVE_ENDPOINT: JSON.stringify(process.env.LIVE_ENDPOINT) || JSON.stringify("live.nodeworld.io")
        }),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.AggressiveMergingPlugin(),
        new ManifestPlugin(),
        //new BundleAnalyzerPlugin()
    ]
}