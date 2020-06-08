const path = require('path');

const babelLoaderConfiguration = {
	test: /\.jsx?$/,
	// Add every directory that needs to be compiled by Babel during the build
	include: [
		path.resolve(__dirname, '../index.web.js'),
		path.resolve(__dirname, '../src'),
		path.resolve(__dirname, '../env'),
	],
	use: {
		loader: 'babel-loader',
		options: {
			cacheDirectory: true,
			plugins: [
				'react-hot-loader/babel',
				'transform-decorators-legacy',
				'transform-object-rest-spread',
				'transform-class-properties',
				[
					'babel-plugin-transform-builtin-extend',
					{
						globals: ['Error', 'Array'],
					},
				],
			],
			presets: [
				'react',
				[
					'env',
					{
						// For HMR
						modules: false,
					},
				],
			],
		},
	},
};

// This is needed for webpack to import static images in JavaScript files
const imageLoaderConfiguration = {
	test: /\.(gif|jpe?g|png)$/,
	use: {
		loader: 'url-loader',
		options: {
			name: '[name].[ext]',
		},
	},
};

const sassLoaderConfiguration = extractSass => ({
	test: /\.scss$/,
	use: extractSass.extract({
		use: [
			{ loader: 'css-loader' },
			{
				loader: 'sass-loader',
				options: {
					outputStyle: 'compressed',
				},
			},
		],
		// use style-loader in development
		fallback: 'style-loader',
	}),
	/*
	use: [
		{ loader: 'style-loader' },
		{ loader: 'css-loader' },
		{ loader: 'sass-loader' },
	],
	*/
});

module.exports = extractSass => ({
	imageLoaderConfiguration,
	babelLoaderConfiguration,
	sassLoaderConfiguration: sassLoaderConfiguration(extractSass),
});
