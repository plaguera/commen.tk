const path = require('path');

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
        }, ],
    },
};