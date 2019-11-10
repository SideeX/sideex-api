var path = require('path');
var merge = require('webpack-merge');
const webpack = require('webpack');
var common = require('./webpack.common.js');
const HtmlWebPackPlugin = require('html-webpack-plugin');

module.exports = merge(common, {
    entry: {
        index: ['./src/sideex-api/index.js']
    },
    output: {
        path: path.resolve(__dirname, 'dist/api'),
        libraryTarget: 'umd',
        filename: 'sideex.api.js'
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
    ]
});
