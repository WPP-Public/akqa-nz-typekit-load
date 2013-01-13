// DOM class mock

/*jshint browser:true, laxbreak:true */
( function( define ) {
define( 'dom-class', function() {

	var domclass, api;

	api = {
		add: function() {},
		remove: function() {},
		has: function() {},
		get: function() {}
	};

	domclass = function() {
		return api;
	};

	window._domClassMock = api;

	return domclass;
} );
} )( typeof define == 'function'
	? define
	: function( id, factory ) { this.DOMClass = factory(); }
	// Boilerplate for AMD, and browser global
);