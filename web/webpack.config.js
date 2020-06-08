const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const extractSass = new ExtractTextPlugin({
	disable: true,
});

const {
	imageLoaderConfiguration,
	babelLoaderConfiguration,
	sassLoaderConfiguration,
} = require('./loaderConfiguration')(extractSass);

const devServer = {
	contentBase: path.join(__dirname, 'dist'),
	// enable HMR
	hot: true,
	// embed the webpack-dev-server runtime into the bundle
	inline: true,
	// serve index.html in place of 404 responses to allow HTML5 history
	historyApiFallback: true,
	port: 3000,
};

const devEnvPath = path.resolve(__dirname, '../etc/env.dev.js');
const stubDLMngrPath = path.resolve(__dirname, '../src/brwc/DownloadManager.stub.js');
const stubNodeIniPath = path.resolve(__dirname, '../src/brwc/node-ini/node-ini.stub.js');

module.exports = env => {
	const envPath = env && env.config && path.resolve(__dirname, `../${env.config}`);

	return {
		// ...the rest of your config
		devServer,
		entry: [
			'react-hot-loader/patch',
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
					test: /\.(otf|ttf|eot|woff|woff2|svg)$/,
					loader: 'url-loader',
				},
			],
		},
		output: {
			path: path.join(__dirname, 'dist'),
			filename: 'app.js',
			publicPath: '/',
		},
		devtool: 'source-map',
		plugins: [
			extractSass,
			new webpack.NamedModulesPlugin(),
			new webpack.HotModuleReplacementPlugin(),
			// `process.env.NODE_ENV === 'production'` must be `true` for production
			// builds to eliminate development checks and reduce build size. You may
			// wish to include additional optimizations.
			new webpack.DefinePlugin({
				'process.env.NODE_ENV': JSON.stringify('development'),
			}),
			// If a custom env file exists, we replace etc/env.js imports with it (it will
			// replace it, not merge it; if you need to merge, do it in the env file itself)
			new webpack.NormalModuleReplacementPlugin(/etc\/env(\.js)?$/, resource => {
				if (fs.existsSync(envPath)) {
					resource.request = envPath;
				} else if (fs.existsSync(devEnvPath)) {
					resource.request = devEnvPath;
				}
			}),
			// We replace DownloadManager.js imports to DownloadManager.stub.js
			//
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
		],
		resolve: {
			// If you're working on a multi-platform React Native app, web-specific
			// module implementations should be written in files using the extension
			// `.web.js`.
			extensions: ['.web.js', '.web.jsx', '.js', '.jsx'],
		},
	};
};
