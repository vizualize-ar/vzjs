const path = require('path');
// var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    // main: './src/index.ts',
    rotator: './src/examples/rotator.ts',
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.(ts|tsx)?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.html$/i,
        loader: 'html-loader',
      },
    ],
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  // devServer: {
  //   contentBase: [path.join(__dirname, 'public'), path.join(__dirname, 'dist')],
  //   contentBasePublicPath: ["/", "/dist"]
  // },
  // devServer: {
  //   contentBase: path.join(__dirname, 'public'),
  //   contentBasePublicPath: "/",
  // },
  devServer: {
    host: '0.0.0.0',
    port: 5000,
    disableHostCheck: true,
  },
  plugins: [
    // new HtmlWebpackPlugin({
    //   filename: 'rotator.html',
    //   template: 'src/examples/rotator/rotator.html',
    //   chunks: ['main']
    // }),
    new CopyWebpackPlugin({
      patterns: [{
        from: './src/examples/**/*.html',
        flatten: true,
      }],
    })
  ]
};