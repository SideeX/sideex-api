var path = require('path');
var HtmlWebPackPlugin = require('html-webpack-plugin');
var merge = require('webpack-merge');
var common = require('./webpack.common.js');
var common1 = require('./webpack.common.1.js');
const TerserPlugin = require('terser-webpack-plugin');
var cache = {};
module.exports = [
    merge(common1, {
        mode: 'development',
        entry: {
            "option/js/option": ["./src/option/js/options.js"],
            "background/background_script": ["./src/background/storage-initialization.js", "./src/background/background.js"],
            "content/document_start": ["./src/content/pageScript-injecter.js"],
            "content/document_end": ["./src/content/command-receiver.js", "./src/content/prompt-injecter.js", "./src/content/content-initialization.js"],
            "page/pageScript":["./src/page/keys.js", "./src/page/autoWait.js", "./src/page/getListener.js", "./src/page/runScript.js", "./src/page/onsubmit.js"]
        },
        output: {
            filename: '[name].js',
            path: path.resolve(__dirname, './src'),
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
                'babel-polyfill',
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
                }
            ]
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
    })
];
