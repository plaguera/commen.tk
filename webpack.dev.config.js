const path = require('path');
var webpack = require('webpack');
new webpack.EnvironmentPlugin({
    NODE_ENV: 'development', // use 'development' unless process.env.NODE_ENV is defined
});

module.exports = {
    entry: {
        client: './src/public/js/client.js',
        index: './src/public/js/index.js'
    },
    output: {
        path: path.join(__dirname, "dist/public"),
        filename: "[name].js"
    },
    mode: 'development',
    module: {
        rules: [{
                test: /\.s[ac]ss$/i,
                use: [
                    // Creates `style` nodes from JS strings
                    'style-loader',
                    // Translates CSS into CommonJS
                    'css-loader',
                    // Compiles Sass to CSS
                    'sass-loader',
                ],
            },
            {
                test: /\.(html)$/i,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                },
            },
        ],
    },
};