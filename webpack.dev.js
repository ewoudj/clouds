const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist',
    clientLogLevel: 'info',
    port: 8080,
    inline: true,
    historyApiFallback: false,
    https: true,
    watchOptions: {
      aggregateTimeout: 300,
      poll: 500,
    },
  },
});