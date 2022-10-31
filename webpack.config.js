const webpack			= require('webpack');

module.exports = {
    target: 'web',
    mode: 'production', // production | development
    entry: [ './src/index.js' ],
    output: {
	filename: process.env.OUTPUT,
	globalObject: 'this',
	library: {
	    "name": "Identicons",
	    "type": "umd",
	},
    },
    stats: {
	colors: true
    },
    devtool: 'source-map',
};
