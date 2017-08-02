var path = require('path');

module.exports = function (config) {
    var coverageLoaders = [];

    config.set({
        browsers: [ 'PhantomJS' ],
        frameworks: [ 'jasmine' ],
        reporters: ['progress', 'coverage'],

        files: [
            'test/*.js'
        ],

        preprocessors: {
            'src/*.js': [ 'webpack', 'coverage' ],
            'test/*.js': [ 'webpack' ]
        },

        singleRun: true,

        webpack: {
            devtool: 'inline-source-map',
            module: {
                rules: [
                    {
                        test: /\.js$/,
                        enforce: "pre",
                        use: 'babel-loader',
                        include: [
                            path.resolve('src/'),
                            path.resolve('test/')
                        ]
                    },
                    {
                        test: /\.js$/,
                        include: path.resolve('src/'),
                        exclude: [/node_modules/],
                        loader: 'istanbul-instrumenter-loader'
                    }
                ]
            }
        },

        webpackServer: {
            noInfo: true
        },

        coverageReporter: {
            type: 'lcov',
            dir: 'coverage/',
            subdir: '.'
        }
    })
}
