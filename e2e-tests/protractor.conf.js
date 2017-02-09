//jshint strict: false
exports.config = {

    allScriptsTimeout: 11000,

    specs: [
        'clientApp/*.js',
        'kitchenApp/*.js',
    ],

    capabilities: {
        'browserName': 'chrome'
    },

    baseUrl: 'http://localhost:3000/',

    framework: 'jasmine',

    jasmineNodeOpts: {
        defaultTimeoutInterval: 30000
    }

};