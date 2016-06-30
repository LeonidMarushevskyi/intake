// Karma configuration
// Generated on Thu Jun 30 2016 11:04:09 GMT-0400 (EDT)

module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      'public/assets/vendor.js',
      'public/assets/application-test.js',
    ],
    exclude: [ ],
    preprocessors: { },
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome', 'Firefox'],
    captureTimeout: 60000,
    browserNoActivityTimeout: 30000,
    singleRun: true,
  })
}
