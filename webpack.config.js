'use strict';

const path = require('path'),
    UglifyJsPlugin = require('uglifyjs-webpack-plugin'),
    HTMLWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: path.resolve(__dirname, 'src/App.js'),
    output: {
        path: path.resolve('public/js'),
        filename: 'bundle.js'
    },
    module: {
        rules: [{
            test: /\.js$/,
            loader: 'babel-loader',
            include: [
                /src/
            ],
        }, {
            test: /\.css$/,
            use: ['style-loader', {
                loader: 'css-loader',
                options: {
                    modules: true
                }
            }]
        }]
    },
    plugins: [
        new HTMLWebpackPlugin({
            template: path.resolve(__dirname, 'src/index.html'),
            filename: path.resolve(__dirname, 'public/index.html')
        })
    ],
    devServer: {
        port: 3000,
        contentBase: path.resolve(__dirname, 'public'),
        compress: true
    }
};