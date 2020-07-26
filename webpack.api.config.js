var merge = require('webpack-merge');
var nodeExternals = require('webpack-node-externals');
var browserConfig = require('./webpack.browser.config');

module.exports = merge(browserConfig, {
    externals: [nodeExternals()],
    output: {
        filename: '[name].bundle.js'
    }
});
