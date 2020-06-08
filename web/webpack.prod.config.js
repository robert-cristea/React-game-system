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
const stubNodeIniPath = path.resolve(__dirname, '../src/brwc/node-ini/node-ini.stub.js');

module.exports = env => {
	const envPath = env && env.config && path.resolve(__dirname, `../${env.config}`);

	return {
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
			// If a custom env file exists, we replace etc/env.js imports with it (it will
			// replace it, not merge it; if you need to merge, do it in the env file itself)
			new webpack.NormalModuleReplacementPlugin(/etc\/env(\.js)?$/, resource => {
				if (fs.existsSync(envPath)) {
					resource.request = envPath;
				}
			}),
			// We replace DownloadManager.js imports to DownloadManager.stub.js
			new webpack.NormalModuleReplacementPlugin(/brwc\/DownloadManager(\.js)?$/, resource => {
				if (fs.existsSync(stubDLMngrPath)) {
					resource.request = stubDLMngrPath;
				}
			}),
			// We replace node-ini.js imports to node-ini.stub.js
			//
			new webpack.NormalModuleReplacementPlugin(/brwc\/node-ini\/node-ini(\.js)?$/, resource => {
				if (fs.existsSync(stubNodeIniPath)) {
					resource.request = stubNodeIniPath;
				}
			}),
			new UglifyJsPlugin(),
		],

		resolve: {
			extensions: ['.web.js', '.web.jsx', '.js', '.jsx'],
		},
	};
};
