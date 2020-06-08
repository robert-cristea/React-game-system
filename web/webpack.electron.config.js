/* eslint-disable import/no-extraneous-dependencies */
const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const extractSass = new ExtractTextPlugin({
	filename: 'app.css',
});

const {
	imageLoaderConfiguration,
	babelLoaderConfiguration,
	sassLoaderConfiguration,
} = require('./loaderConfiguration')(extractSass);

const stubDLMngrPath = path.resolve(__dirname, '../src/brwc/DownloadManager.stub.js');

module.exports = {
	// ...the rest of your config

	entry: [
		'whatwg-fetch', // window.fetch polyfill
		path.resolve(__dirname, '../index.web.js'),
		path.resolve(__dirname, '../src/sass/app.scss'),
	],
	module: {
		rules: [
			babelLoaderConfiguration,
			imageLoaderConfiguration,
			sassLoaderConfiguration,
			{
				test: /\.(ttf|eot|woff|woff2|svg)$/,
				loader: 'url-loader',
			},
			{
				test: /\.node$/,
				loader: 'awesome-node-loader',
			},
		],
	},
	output: {
		path: path.join(__dirname, 'dist'),
		filename: 'app.js',
	},
	devtool: 'inline-source-map',
	plugins: [
		extractSass,
		// `process.env.NODE_ENV === 'production'` must be `true` for production
		// builds to eliminate development checks and reduce build size. You may
		// wish to include additional optimizations.
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify('production'),
		}),
		new UglifyJsPlugin(),

		// We replace DownloadManager.js imports to DownloadManager.stub.js
		//
		new webpack.NormalModuleReplacementPlugin(/brwc\/DownloadManager(\.js)?$/, resource => {
			if (process.platform === 'darwin' && fs.existsSync(stubDLMngrPath)) {
				resource.request = stubDLMngrPath;
			}
		}),
	],

	resolve: {
		extensions: ['.web.js', '.web.jsx', '.js', '.jsx'],
	},
	// target: 'node',
	target: 'electron-renderer',
	node: {
		__dirname: false,
		__filename: false,
	},
};
