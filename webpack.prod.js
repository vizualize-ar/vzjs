const TerserJSPlugin = require('terser-webpack-plugin');
const JavaScriptObfuscator = require('webpack-obfuscator');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var DefinePlugin = require('webpack').DefinePlugin;
const path = require('path');
const baseConfig = require("./webpack.base");

module.exports = {
  mode: 'production',
  optimization: {
    minimize: true,
    minimizer: [
      new TerserJSPlugin({
        terserOptions: { 
        //   mangle: {
        //     properties: {
        //       // see https://stackoverflow.com/questions/58835084/webpackterserplugin-mangle-ignores-properties-and-class-names-poor-quality-o
        //       regex: /(^P1|^p1|^_p1)_\w*/
        //     },
        //   },
          compress: {
            drop_console: true,
          },
        },
      }),
      new OptimizeCSSAssetsPlugin({})],
  },
  entry: {
    embed: './src/embed/embed.ts',
    // "demos/simplyfit/index": './src/demos/simplyfit/index.ts',
    // "demos/lampsplus/index": './src/demos/lampsplus/index.ts',
    // "demos/gstakis/index": './src/demos/gstakis/index.ts',
  },
  // devtool: 'source-map',
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
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      // this works but doesn't obfuscate as much as the plugin
      // {
      //   test: /\.(ts|js)$/,
      //   exclude: [ 
      //       path.resolve(__dirname, 'excluded_file_name.js') 
      //   ],
      //   enforce: 'post',
      //   use: { 
      //       loader: JavaScriptObfuscator.loader, 
      //       options: {
      //         identifierNamesGenerator: 'mangled',
      //       }
      //   }
      // },
    ],
  },
  resolve: {
    extensions: [ '.ts', '.js' ],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    // new CopyWebpackPlugin({
    //   patterns: [
    //     {
    //       from: './src/demos/**/*',
    //       transformPath(targetPath, absolutePath) {
    //         return targetPath.replace("src\\", "");
    //       },
    //       globOptions: {
    //         ignore: ['**/*.ts'],
    //       },
    //     }
    //   ]
    // }),
    new DefinePlugin({
      // 'process.env': JSON.stringify(require('dotenv').config().parsed),
      'process.env': JSON.stringify(baseConfig.config),
    }),
    new JavaScriptObfuscator ({
      identifierNamesGenerator: 'mangled',
      optionsPreset: 'low-obfuscation'
    })
  ]
};