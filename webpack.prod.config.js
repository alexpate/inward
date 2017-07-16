const config = require('./webpack.config');
const webpack = require('webpack');
const CompressionPlugin = require('compression-webpack-plugin');

config.plugins.push(
  new CompressionPlugin({
    asset: '[path].gz[query]',
    algorithm: 'gzip',
    minRatio: 0.8,
  })
);

module.exports = config;
