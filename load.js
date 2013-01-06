
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

	/**
	 * On succesful download on typekit file, try to load font
	 */
	success = function() {
		try {
			window.Typekit.load( { active: finished, inactive: error } );
		} catch( e ) {
			error();
		}
	};

	/**
	 * On errored state, cleanup and set error class
	 */
	error = function() {
		finished();
		head.add( messages[ 2 ] );
	};

	/**
	 * Clean up loading states on both success and failure
	 */
	finished = function() {
		loading -= 1;
		head.remove( messages[ 1 ] );
		if ( !loading ) { head.remove( messages[ 0 ] ); }
	};

	/**
	 * Download and initialise a typekit font(s) based on a typekit id
	 * @param  {String} typekit_id Id of typekit font set to initialise
	 * @param {Function} cb Success callback
	 * @param {Fuction} er Error callback
	 */
	return function( typekit_id, cb, er ) {
		loading += 1;
		head.add( messages[ 0 ] );
		if ( first_load ) { head.add( messages[ 1 ] ); }
		load( TYPEKIT_URL.replace( '{ID}', typekit_id ),
			function() {
				success();
				if ( cb ) { cb(); }
			},
			function() {
				error();
				if ( er ) { er(); }
			}
		);
	};
} ) );