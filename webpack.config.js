const webpack = require('webpack');
const fs = require('fs');
const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const pkg = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'package.json')));

const banner =
    `${pkg.title} ${pkg.version}
Copyright (c) ${(new Date()).getFullYear()} ${pkg.author.name}`;

const modules = {
    rules: [{
        test: /\.js$/,
        exclude: /node_modules/, // 优化处理加快速度
        use: {
            loader: 'babel-loader',
            options: {
                presets: ['@babel/preset-env']
            }
        }
    }]
};

module.exports = [{
    entry: './poster.js',
    output: {
        filename: 'poster.min.js',
        library: 'poster',
        libraryTarget: 'umd'
    },
    module: modules,
    plugins: [
        new webpack.DefinePlugin({
            '__DEV__': false,
            '__VERSION__': JSON.stringify(pkg.version)
        }),
        new UglifyJSPlugin(),
        new webpack.BannerPlugin(banner)
    ]
}];