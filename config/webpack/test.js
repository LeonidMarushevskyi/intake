// Note: You must restart bin/webpack-dev-server for changes to take effect

const merge = require('webpack-merge')
const sharedConfig = require('./shared.js')
const { env, settings, output, loadersDir } = require('./configuration.js')
const { basename, dirname, join, relative, resolve } = require('path')
module.exports = merge(sharedConfig, {
  entry: './spec/karma_tests.js',
  output: {
    publicPath: undefined // no assets CDN
  },
  externals: {
    'react/addons': 'react/addons',
    'react/lib/ReactContext': 'react/lib/ReactContext',
    'react/lib/ExecutionEnvironment': 'react/lib/ExecutionEnvironment',
  },
  devtool: 'inline-source-map',
})
