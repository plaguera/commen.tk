var path = require('path');

module.exports = {
	devtool: 'source-map',
	entry: './src/index.ts',
	module: {
		rules: [
			{
				test: /\.ts[x]?$/i,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
			{
				test: /\.[s]?[ac]ss$/i,
				use: ['style-loader', 'css-loader', 'sass-loader'],
			},
		],
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js', '.css', '.scss'],
		alias: {
			react: 'preact/compat',
			'react-dom': 'preact/compat',
		},
	},
	output: {
		filename: 'client.js',
		path: path.resolve(__dirname, '../public'),
	},
};
