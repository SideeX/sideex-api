var path = require('path');
var merge = require('webpack-merge');
var common = require('./webpack.common.js');

module.exports = [merge(common, {
    mode: 'development',
    entry: {
        entryPoint: ['./src/panel/js/UI/entryPoint.js'],
    },
    output: {
        path: path.resolve(__dirname, 'dist/extension/panel/js/UI/build'),
        library: 'EntryPoint',
        libraryTarget: 'umd',
        filename: '[name].bundle.js'
    },
})];
