var config = module.exports;

config[ 'browser global' ] = {
	environment: 'browser',
	rootPath: '../',
	tests: [
		'test/*-test.js'
	],
	sources: [
		'test/mocks/load.js',
		'test/mocks/class.js',
		'load.js'
	]
};

config[ 'browser AMD' ] = {
	environment: 'browser',
	rootPath: '../',
	libs: [
		'node_modules/requirejs/require.js',
		'test/mocks/load.js',
		'test/mocks/class.js'
	],
	tests: [
		'test/*-test.js'
	],
	resources: [
		'load.js'
	],
	extensions: [
		require( 'buster-amd' )
	]
};