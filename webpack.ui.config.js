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
        path: path.resolve(__dirname, 'src/panel/js/UI/build'),
        library: 'Panel',
        libraryTarget: 'umd',
        filename: '[name].bundle.js'
    },
    devServer: {
        host: 'localhost',
        port: 8080,
        contentBase: path.join(__dirname, 'src/panel/js/UI/build'),
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
                        presets: [['env', {
                            "targets": {
                                "browsers": ["last 2 Chrome versions"]
                            },
                            "modules": "commonjs"
                        }]]
                    }
                }
            },
        ]
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: "./src/panel/index_react.html",
            filename: "index_react.html"
        }),
    ]
})];
