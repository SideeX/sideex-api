var path = require('path');
const webpack = require("webpack");
var HtmlWebPackPlugin = require('html-webpack-plugin');
var merge = require('webpack-merge');
var common = require('./webpack.common.js');
const TerserPlugin = require('terser-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
var cache = {};
module.exports = [
    merge(common, {
        entry: {
            "background_script": ["./src/background/storage-initialization.js", "./src/background/background.js"],
            "document_start": ["./src/content/pageScript-injecter.js"],
            "document_end": ["./src/content/prompt-injecter.js", "./src/content/content-initialization.js"],
            "page_script":["./src/page/keys.js", "./src/page/autoWait.js", "./src/page/getListener.js", "./src/page/runScript.js", "./src/page/onsubmit.js"]
        },
        output: {
            filename: '[name].js',
            path: path.resolve(__dirname, './dist/extension'),
            libraryTarget: 'umd'
        },
        optimization: {
            minimizer: [
                new TerserPlugin({
                    parallel: true,
                    terserOptions: {
                        output: {
                            ascii_only: true,
                            beautify: true,
                            comments: true
                        },
                        module: true,
                        toplevel: true,
                        nameCache: cache
                    }
                })
            ]
        },
        plugins: [
            new CopyPlugin([
                {
                    from: './src/manifest.json',
                    to: path.resolve("./dist/extension")
                },
                {
                    from: 'icons/*',
                    context: './src',
                    to: path.resolve("./dist/extension")
                },
                {
                    from: 'option/**/*',
                    context: './src',
                    to: path.resolve("./dist/extension")
                },
                {
                    from: 'page/prompt.js',
                    context: './src',
                    to: path.resolve("./dist/extension/page")
                }
            ]),
            new webpack.ProvidePlugin({
                browser: ["webextension-polyfill-ts", "browser"]
            })
        ]
    }),
];
