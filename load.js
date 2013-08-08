/** @license MIT License (c) Heyday Digital */

/**
 * An asynchronous typekit loader with smarts
 *
 * Licensed under the MIT License at:
 * http://heyday.mit-license.org/
 *
 * @version 0.1.2
 */

/*jshint browser:true, laxbreak:true */
( function( define ) {
define( [ 'async-load', 'dom-class' ], function( load, domClass ) {

	var messages, head, finished, typekitLoad;

	/**
	 * Classes to be added to the document element
	 * @type {Array}
	 */
	messages = [ 'wf-loading', 'wf-firstload', 'wf-inactive' ];

	/**
	 * Dom class manipulator wrapping the document element
	 * @type {DOMClass}
	 */
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
	 * @param {Function} [success] Success callback
	 * @param {Function} [error] Error callback
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
			if ( success ) { setTimeout( success, 0 ); }
		};

		/**
		 * On errored state, cleanup and set error class
		 */
		onError = function() {
			finished();
			head.add( messages[ 2 ] );
			if ( error ) { setTimeout( error, 0 ); }
		};

		/**
		 * Initialize loading of JS file, wait for callback
		 */
		load(
			'//use.typekit.com/' + typekit_id + '.js',
			function() {
				try {
					// Call typekits global load function
					// Will throw if not loaded
					window.Typekit.load( {
						active: onSuccess,
						inactive: onError
					} );
				} catch( e ) {
					onError();
				}
			},
			typekitLoad.timeout
		);
	};

	/**
	 * Sets whether this is the first load,
	 * is reset to false at the end of each load
	 * @type {Boolean}
	 * @private
	 */
	typekitLoad._first = true;

	/**
	 * Integer which holds the current number of loading id's
	 * @type {Int}
	 * @private
	 */
	typekitLoad._loading = 0;

	/**
	 * Timeout value, after this period an id is set to inactive
	 * @type {Int} Timeout in milliseconds
	 */
	typekitLoad.timeout = 2000;

	return typekitLoad;
} );
} )( typeof define == 'function'
	? define
	: function( deps, factory ) { this.typekitLoad = factory( this.asyncLoad, this.domClass ); }
	// Boilerplate for AMD, and browser global
);
