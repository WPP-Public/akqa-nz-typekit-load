
// AMD or browser wrapper for module format
( function( root, factory ) {
	if ( typeof define === 'function' && define.amd ) {
		define( [ 'async-load', 'dom-class' ], factory );
	} else {
		root.DomClass = factory( root.asyncLoad, root.DomClass );
	}
}( this, function( load, DomClass ) {
	'use strict';

	var TYPEKIT_URL = '//use.typekit.com/{ID}.js',
		messages = [ 'wf-loading', 'wf-firstload', 'wf-inactive' ],
		first_load = true, loading = 0,
		head, success, error, finished;

	head = new DomClass( document.documentElement );

	success = function() {
		// Try loading typekit
		try {
			window.Typekit.load( { active: finished, inactive: error } );
		} catch( e ) {
			error();
		}
	};

	error = function() {
		// Set finsihed
		finished();

		// Add error class
		head.add( messages[ 2 ] );
	};

	finished = function() {
		// Set loaded
		loading -= 1;

		// Remove loading class
		if ( !loading ) { head.remove( messages[ 0 ] ); }

		// Remove first load class
		head.remove( messages[ 1 ] );
	};

	return function( typekit_id ) {

		// Add loading class
		head.add( messages[ 0 ] );

		// Add first load class
		if ( first_load ) { head.add( messages[ 1 ] ); }

		loading += 1;

		// Load typekit
		load( TYPEKIT_URL.replace( '{ID}', typekit_id ), success, error );
	};
} ) );