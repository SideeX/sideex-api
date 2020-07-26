var path = require('path');
var merge = require('webpack-merge');
var common = require('./webpack.common');

module.exports = merge(common, {
    entry: {
        index: ['./src/sideex-api/index.js'],
        // test: ['./src/sideex-api/test.js']
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        libraryTarget: 'umd',
        filename: '[name].bundle.mjs'
    },
    devServer: {
        host: 'localhost',
        port: 8080,
        contentBase: path.join(__dirname, 'dist'),
        hot: true,
        open: true,
        openPage: 'index.html'
    },
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
