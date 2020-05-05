var path = require('path');
var HtmlWebPackPlugin = require('html-webpack-plugin');
var merge = require('webpack-merge');
var common = require('./webpack.common.js');

module.exports = [merge(common, {
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ['@babel/env']
                    }
                }
            }
        ]
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: "./src/panel/index_react.html",
            filename: "index_react.html"
        })
    ]
})];
