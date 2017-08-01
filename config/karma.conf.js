/*eslint-env node*/
// Karma configuration
// Generated on Thu Jun 30 2016 11:04:09 GMT-0400 (EDT)
//
var webpack = require('webpack')
var webpackConfig = require('../config/webpack/test.js')

module.exports = function(config) {
  config.set({
    basePath: './',
    frameworks: ['jasmine'],
    files: [
      './../public/packs-test/main.js',
    ],
    preprocessors: {
      './../public/packs-test/main.js': ['webpack'],
    },
    exclude: [
      './../node_modules/'
    ],
    client: {
      // log console output in our test console
      captureConsole: true
    },
    reporters: [ 'coverage', 'dots'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome_no_sandbox', 'Firefox'],
    customLaunchers: {
      Chrome_no_sandbox: {
        base: 'Chrome',
        flags: ['--no-sandbox'],
      },
    },
    captureTimeout: 60000,
    browserNoActivityTimeout: 30000,
    singleRun: true,
    concurrency: Infinity,
    webpackMiddleware: {
      // webpack-dev-middleware configuration
      // i. e.
      stats: 'errors-only'
    },
    webpack: {
      devtool: 'inline-source-map',
      module: webpackConfig.module,
      externals: {
        'react/addons': true,
        'react/lib/ReactContext': true,
        'react-addons-test-utils': true,
        'react/lib/ExecutionEnvironment': true
      }
    },
  })
}
