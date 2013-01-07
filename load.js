/** @license MIT License (c) copyright Heyday Digital */

/**
 * An extremely miminal typekit loader
 *
 * Licensed under the MIT License at:
 * http://heyday.mit-license.org/
 *
 * @version 0.1.0
 */

(function(define) { 'use strict';
define( [ 'async-load', 'dom-class' ], function( load, DomClass ) {

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

} );
} )( typeof define == 'function'
	? define
	: function( deps, factory ) { this.typekitLoad = factory( this.asyncLoad, this.DomClass ); }
	// Boilerplate for AMD, and browser global
);