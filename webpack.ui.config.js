var path = require('path');
var HtmlWebPackPlugin = require('html-webpack-plugin');
var merge = require('webpack-merge');
var common = require('./webpack.common.js');

module.exports = [merge(common, {
    mode: 'development',
    entry: {
        react: ['./src/panel/js/UI/index.js'],
        initial: [
            './src/panel/js/UI/panel.template.js'
        ]
    },
    output: {
        path: path.resolve(__dirname, 'dist/extension/panel/js/UI/build'),
        library: 'Panel',
        libraryTarget: 'umd',
        filename: '[name].bundle.js'
    },
    devServer: {
        host: 'localhost',
        port: 8080,
        contentBase: path.join(__dirname, 'dist/extension/panel/js/UI/build'),
        hot: true,
        open: true,
        openPage: 'index_react.html'
    },
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
