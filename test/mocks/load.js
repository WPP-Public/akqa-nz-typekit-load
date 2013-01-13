// Async loader mock

/*jshint browser:true, laxbreak:true */
( function( define ) {
define( 'async-load', function() {

	var load, mock;

	mock = { load: function() {} };

	load = function() { mock.load.apply( this, arguments ); };

	window._loadMock = mock;

	return load;
} );
} )( typeof define == 'function'
	? define
	: function( id, factory ) { this.asyncLoad = factory(); }
	// Boilerplate for AMD, and browser global
);