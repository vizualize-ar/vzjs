const baseConfig = require('./webpack.base');
const path = require('path');
// var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var DefinePlugin = require('webpack').DefinePlugin;

module.exports = {
  entry: {
    // main: './src/index.ts',
    embed: './src/embed/embed.ts',
    "examples/rotator": './src/examples/rotator.ts',
    "examples/translate": './src/examples/translate.ts',
    "examples/gltfexport": './src/examples/gltfexport.ts',
    "demos/simplyfit/index": './src/demos/simplyfit/index.ts',
    "demos/lampsplus/index": './src/demos/lampsplus/index.ts',
    "demos/gstakis/index": './src/demos/gstakis/index.ts',
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
    extensions: ['.ts', '.js'],
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
      patterns: [
        {
          from: './src/examples/**/*.html',
          transformPath(targetPath, absolutePath) {
            return targetPath.replace("src\\", "");
          },
          globOptions: {
            ignore: ['**/*.ts'],
          },
        },
        {
          from: './src/demos/**/*',
          transformPath(targetPath, absolutePath) {
            return targetPath.replace("src\\", "");
          },
          globOptions: {
            ignore: ['**/*.ts'],
          },
        },
        // Not currently being used
        // {
        //   from: './src/embed/qlbanner.html',
        //   to: 'embed'
        // }
      ]
    }),
    new DefinePlugin({
      // 'process.env': JSON.stringify(require('dotenv').config().parsed),
      'process.env': JSON.stringify(baseConfig.config),
    }),
  ]
};