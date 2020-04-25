const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FixStyleOnlyEntriesPlugin = require("webpack-fix-style-only-entries");
var path = require('path');
var glob = require('glob');

// Get all themes and save them as entry points
var entries = {
	'client': './src/index.tsx'
};
glob.sync('./src/stylesheets/themes/**/app.scss').forEach((theme) => entries[theme.split('/')[4]] = theme);

module.exports = {
	devtool: 'source-map',
	entry: entries,
	module: {
		rules: [
			{
				test: /\.ts[x]?$/i,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
			{
				test: /\.s[ac]ss$/i,
				use: [
					{
						'loader': MiniCssExtractPlugin.loader,
					},
					{
						loader: 'css-loader',
						options: {
							sourceMap: true,
						},
					},
					{
						loader: 'sass-loader',
						options: {
							sourceMap: true,
						},
					},
				],
			},
		],
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js', '.css', '.scss'],
		alias: {
			'react': 'preact/compat',
			'react-dom': 'preact/compat',
		},
	},
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, '../public'),
	},
	plugins: [
		new FixStyleOnlyEntriesPlugin(),
		new MiniCssExtractPlugin({
			// Options similar to the same options in webpackOptions.output
			// both options are optional
			filename: 'themes/[name].css',
			chunkFilename: '[id].css',
		}),
	],
};
