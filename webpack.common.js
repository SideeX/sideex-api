const fs = require('fs');
if (!fs.existsSync("./.env")) {
    fs.copyFileSync("./.env.template", "./.env");
}
const env = require('dotenv').config().parsed;
module.exports = {
    mode: env.NODE_ENV,
    performance: {
        hints: false
    },
    stats: {
        excludeAssets: (assetName) => {
            return !assetName.match(/\.[jt]sx?$/);
        },
        modules: false
    },
    target: 'web',
    watch: true,
    watchOptions: {
        ignored: /node_modules/
    },
    devtool: false,
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json']
    },
    module: {
        rules: [
            {
                test: /\.[jt]sx?$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ['@babel/env']
                    }
                }
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: "html-loader",
                        options: { minimize: false }
                    }
                ]
            },
            {
                test: /\.(scss|css)$/,
                use: [
                    'style-loader',
                    {
                        loader: "css-loader",
                        options: {
                            modules: true,
                            localIdentName: '[name]__[local]___[hash:base64:5]'
                        }
                    },
                    'postcss-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.(jpe?g|png|gif)$/i,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192
                        }
                    }
                ]
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'assets'
                        }
                    }
                ]
            }
        ]
    }
};
