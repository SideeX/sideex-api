var path = require('path');
var HtmlWebPackPlugin = require('html-webpack-plugin');
var merge = require('webpack-merge');
var common = require('./webpack.common.js');
const TerserPlugin = require('terser-webpack-plugin');
var cache = {};
module.exports = [
    merge(common, {
        entry: {
            "options": ["./src/option/js/options.js"],
            "background_script": ["./src/background/storage-initialization.js", "./src/background/background.js"],
            "document_start": ["./src/content/pageScript-injecter.js"],
            "document_end": ["./src/content/command-receiver.js", "./src/content/prompt-injecter.js", "./src/content/content-initialization.js"],
            "page_script":["./src/page/keys.js", "./src/page/autoWait.js", "./src/page/getListener.js", "./src/page/runScript.js", "./src/page/onsubmit.js"]
        },
        output: {
            filename: '[name].js',
            path: path.resolve(__dirname, './src/build'),
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
        }
    }),
    merge(common, {
        mode: 'development',
        entry: {
            react: ['./src/panel/js/UI/index.js'],
            initial: [
                './src/panel/js/background/initial.js'
            ]
        },
        output: {
            path: path.resolve(__dirname, 'src/panel/js/UI/build'),
            library: 'Panel',
            libraryTarget: 'umd',
            filename: '[name].bundle.js'
        },
        devServer: {
            contentBase: path.join(__dirname, 'src/panel/js/UI/build')
        },
        plugins: [
            new HtmlWebPackPlugin({
                template: "./src/panel/index_react.html",
                filename: "index_react.html"
            })
        ]
    }),
    merge(common, {
        mode: 'development',
        entry: {
            entryPoint: ['./src/panel/js/UI/entryPoint.js']
        },
        output: {
            path: path.resolve(__dirname, 'src/panel/js/UI/build'),
            library: 'EntryPoint',
            libraryTarget: 'umd',
            filename: '[name].bundle.js'
        },
        devServer: {
            contentBase: path.join(__dirname, 'src/panel/js/UI/build')
        }
    }),
    merge(common, {
        mode: 'development',
        entry: {
            sideex: ['./src/panel/js/background/api.js']
        },
        output: {
            path: path.resolve(__dirname, 'src/panel/js/UI/build'),
            library: 'SideeX',
            libraryTarget: 'umd',
            filename: '[name].bundle.js'
        },
        devServer: {
            contentBase: path.join(__dirname, 'src/panel/js/UI/build')
        }
    })
];
