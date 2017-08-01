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
      //{pattern: './../app/javascript/**/*.js', watched: true},
      //{pattern: './../public/packs-test/**/*.js', watched: false},
      {pattern: './../spec/karma_tests.js', watched: false},
    ],
    preprocessors: {
      //'./../spec/**/*Spec.js': ['webpack', 'babel'],
      //'./../public/packs-test/**/*.js': ['webpack'],
      './../spec/karma_tests.js': ['webpack'],
    },
    exclude: [
      './../node_modules/'
    ],
    client: {
      // log console output in our test console
      captureConsole: true
    },
    reporters: ['progress', 'coverage'],
    // coverageReporter: {
    //   type: 'in-memory',
    // },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    // browsers: ['Chrome_no_sandbox', 'Firefox'],
    browsers: ['Chrome_no_sandbox'],
    customLaunchers: {
      Chrome_no_sandbox: {
        base: 'Chrome',
        flags: ['--no-sandbox'],
      },
    },
    captureTimeout: 60000,
    browserNoActivityTimeout: 30000,
    singleRun: true,
    //concurrency: Infinity,
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
    // plugins: [
    //   'karma-sourcemap-loader',
    //   'karma-htmlfile-reporter',
    //   'karma-jasmine',
    //   'karma-coverage',
    //   'karma-chrome-launcher',
    //   'karma-firefox-launcher',
    //   'karma-webpack',
    //   'istanbul-instrumenter-loader'
    // ]
  })
}
