/*eslint-env node*/
// Karma configuration
// Generated on Thu Jun 30 2016 11:04:09 GMT-0400 (EDT)
//
module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      'public/assets/vendor.js',
      'public/packs/*',
    ],
    exclude: [],
    preprocessors: {
      'public/packs/*': ['coverage', 'sourcemap'],
    },
    coverageReporter: {
      type: 'in-memory',
    },
    remapIstanbulReporter: {
      remapOptions: {
        exclude: /node_modules/,
      },
      reports: {
        html: `${process.env.CI_REPORTS}/coverage/js`,
      },
      subdir: (browser) => {
        return browser.toLowerCase().split(' ').first()
      },
    },
    junitReporter: {
      outputDir: process.env.CI_REPORTS, // results will be saved as $outputDir/$browserName.xml
      outputFile: undefined, // if included, results will be saved as $outputDir/$browserName/$outputFile
      suite: '', // suite will become the package name attribute in xml testsuite element
      useBrowserName: true, // add browser name to report and classes names
      nameFormatter: undefined, // function (browser, result) to customize the name attribute in xml testcase element
      classNameFormatter: undefined, // function (browser, result) to customize the classname attribute in xml testcase element
      properties: {}, // key value pair of properties to add to the <properties> section of the report
    },
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
  })
}
