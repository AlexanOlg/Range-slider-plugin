const path = require('path');
const webpack = require('webpack');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

function getRules(type) {
  const scssLoaders = {
    dev: ['style-loader', 'css-loader', 'sass-loader'],
    prod: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
  };

  return [
    {
      test: /\.(scss)$/,
      use: scssLoaders[type],
    },
    {
      test: /\.ts$/,
      use: 'ts-loader',
    },
  ];
}

function getPlugins(type) {
  return [
    new HTMLWebpackPlugin({
      currentEnv: process.env.NODE_ENV,
      filename: 'index.html',
      template: './index.html',
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
    }),
    new CleanWebpackPlugin(),
  ].concat(type === 'prod' ? (
    new MiniCssExtractPlugin({
      filename: '[name].css',
    })
  ) : []);
}

const commonConfig = {
  target: 'web',
  context: path.resolve(__dirname, '..', 'src'),
  entry: {
    plugin: ['./index.ts', './index.scss'],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, '..', 'dist'),
  },
  resolve: {
    extensions: ['.js', '.ts', '.json'],
  },
};

module.exports = { commonConfig, getRules, getPlugins };
