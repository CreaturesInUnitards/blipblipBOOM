const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
	entry: path.resolve(__dirname, './src/index.js'),
	module: {
		loaders: [
			{ test: /\.js$/, loader: 'babel-loader' }
		],
		rules: [
			{
				test: /\.sass$/,
				use: [
					{
						loader: 'style-loader' 
					},
					{
						loader: 'css-loader',
						options: { sourceMap: true }
					},
					{
						loader: 'postcss-loader'
					},
					{
						loader: 'sass-loader',
						options: { sourceMap: true }
					}
				]
			},
			{
				test: /\.html$/,
				use: [
					'raw-loader'
				]
			},
			{
				test: /\.(png|jpg|gif)$/,
				use: [
					'raw-loader',
					'img-loader'
				]
			}
		]
	},
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, './build')
	},
	devtool: 'source-map',
	watch: true,
	plugins: [
		new HtmlWebpackPlugin({template: './template.ejs'}),
		new CopyWebpackPlugin([{from: 'src/images', to: 'images/'}]),
	]
}