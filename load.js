/** @license MIT License (c) copyright Heyday Digital */

/**
 * An extremely miminal typekit loader
 *
 * Licensed under the MIT License at:
 * http://heyday.mit-license.org/
 *
 * @version 0.1.0
 */

/*jshint browser:true, laxbreak:true */
( function( define ) { 'use strict';
define( [ 'async-load', 'dom-class' ], function( load, domClass ) {

	var messages = [ 'wf-loading', 'wf-firstload', 'wf-inactive' ],
		head, finished,
		typekitLoad;

	head = domClass( document.documentElement );

	/**
	 * Clean up loading states on both success and failure
	 */
	finished = function() {
		typekitLoad._loading -= 1;
		typekitLoad._first = false;
		head.remove( messages[ 1 ] );
		if ( !typekitLoad._loading ) { head.remove( messages[ 0 ] ); }
	};

	/**
	 * Download and initialise a typekit font(s) based on a typekit id
	 * @param  {String} typekit_id Id of typekit font set to initialise
	 * @param {Function} cb Success callback
	 * @param {Fuction} er Error callback
	 */
	typekitLoad = function( typekit_id, success, error ) {
		var onSuccess, onError;
		typekitLoad._loading += 1;
		head.add( messages[ 0 ] );
		if ( typekitLoad._first ) { head.add( messages[ 1 ] ); }


		/**
		 * On success state, cleanup
		 */
		onSuccess = function() {
			finished();

			// Break try catch scope so it doesn't suppress errors
			if ( success ) {
				setTimeout( success, 0 );
			}
		};


		/**
		 * On errored state, cleanup and set error class
		 */
		onError = function() {
			finished();
			head.add( messages[ 2 ] );
			if ( error ) { error(); }
		};

		load( '//use.typekit.com/' + typekit_id + '.js',
			function() {
				try {
					window.Typekit.load( { active: onSuccess, inactive: onError } );
				} catch( e ) {
					onError();
				}
			},
			typekitLoad.timeout
		);
	};

	typekitLoad._first = true;
	typekitLoad._loading = 0;
	typekitLoad.timeout = 2000;

	return typekitLoad;
} );
} )( typeof define == 'function'
	? define
	: function( deps, factory ) { this.typekitLoad = factory( this.asyncLoad, this.DOMClass ); }
	// Boilerplate for AMD, and browser global
);