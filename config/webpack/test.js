// Note: You must restart bin/webpack-dev-server for changes to take effect

const merge = require('webpack-merge')
const sharedConfig = require('./shared.js')
const { env, settings, output, loadersDir } = require('./configuration.js')
const { basename, dirname, join, relative, resolve } = require('path')
console.log(settings.source_path, settings.source_entry_path,'<<<<------------ settings current .path')
module.exports = merge(sharedConfig, {
  entry: './spec/karma_tests.js',
  output: {
    // client assets are output to dist/test/
    path: join(output.path, 'test'),
    publicPath: undefined // no assets CDN
  },
  devtool: 'inline-source-map', // sourcemap support
})
