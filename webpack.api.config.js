var path = require('path');
var merge = require('webpack-merge');
const webpack = require('webpack');
var common = require('./webpack.common.js');
module.exports = merge(common, {
    entry: {
        sideex: ['./src/panel/js/background/api.js']
    },
    output: {
        path: path.resolve(__dirname, 'dist/api'),
        libraryTarget: 'umd',
        filename: '[name].bundle.js'
    },
    devServer: {
        contentBase: path.join(__dirname, 'dist/api')
    },
    plugins: [
        new webpack.NormalModuleReplacementPlugin(/entryPoint\.js$/, path.resolve("./src/panel/js/UI/entryPoint-empty.js"))
    ]
})