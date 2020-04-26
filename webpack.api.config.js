var path = require('path');
var merge = require('webpack-merge');
const webpack = require('webpack');
var common = require('./webpack.common.js');
var nodeExternals = require('webpack-node-externals');
const HtmlWebPackPlugin = require('html-webpack-plugin');

module.exports = merge(common, {
    externals: [nodeExternals()],
    entry: {
        index: ['./src/sideex-api/index.js'],
        test: ['./src/sideex-api/test.js']
    },
    output: {
        path: path.resolve(__dirname, 'dist/api'),
        library: 'SideeX',
        libraryTarget: 'umd',
        filename: '[name].bundle.js'
    },
    devServer: {
        host: 'localhost',
        port: 8080,
        contentBase: path.join(__dirname, 'dist/api'),
        hot: true,
        open: true,
        openPage: 'index.html'
    },
    plugins: [
        new webpack.NormalModuleReplacementPlugin(/entryPoint\.js$/, path.resolve("./src/panel/js/UI/entryPoint-empty.js")),
        new HtmlWebPackPlugin({
            template: "./src/sideex-api/index.html",
            filename: "index.html"
        })
    ],
    module: {
        rules: [
            {
                test: /\.[jt]sx?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: "webpack-preprocessor-loader",
                        options: {
                            params: {
                                isExt: false
                            }
                        }
                    }
                ]
            }
        ]
    }
});
