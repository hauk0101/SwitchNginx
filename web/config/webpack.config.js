const path = require('path');
const nodeExternals = require('webpack-node-externals');
const HtmlWebPackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        app: './web/src/index.js'
    },
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: 'main.js'
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json','.jsx']
    },

    module: {
        rules: [
            {
                test: /(\.jsx|\.js)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            }
        ]
    },
    plugins:[
        new HtmlWebPackPlugin({
            template: './web/src/index.html',
            filename: './index.html'
        })
    ],
    devServer:{
        contentBase: path.join(__dirname, '../dist'),
        host:'localhost',    //服务器的ip地址
        port:1234,    //端口
        open:true,    //自动打开页面
    }
}
