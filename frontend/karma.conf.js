module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-spec-reporter'), // ✅ NEU
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      clearContext: false
    },
    reporters: ['spec'], // ✅ nur spec
    specReporter: {
      suppressErrorSummary: false,
      suppressFailed: false,
      suppressPassed: false,
      suppressSkipped: true,
      showSpecTiming: true
    },
    browsers: ['ChromeHeadlessNoSandbox'],
    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox', '--disable-gpu']
      }
    },
    restartOnFileChange: true
  });
};
