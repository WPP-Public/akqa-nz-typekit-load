/*jshint browser:true, laxbreak:true */
( function( define ) { 'use strict';
define( [ 'buster', '../load' ], function( buster, typekitLoad ) {

	// Buster setup
	var expect = buster.assertions.expect,
		describe = buster.spec.describe, it = buster.spec.it,
		before = buster.spec.before, after = buster.spec.after;

	//
	// Tests
	//
	describe( 'Typekit Load', function() {
		before( function() {
			typekitLoad._first = true;
			typekitLoad._loading = 0;
		} );

		it( 'is defined', function() {
			expect( typekitLoad ).toBeDefined();
			expect( typekitLoad ).toBeFunction();
		} );

		describe( 'Initialize loading', function() {
			before( function() {
				this.loader = this.spy( window._loadMock, 'load' );
				this.domclassAdd = this.spy( window._domClassMock, 'add' );
				this.domclassRemove = this.spy( window._domClassMock, 'remove' );
			} );

			it( 'increments loading counter', function() {
				typekitLoad( '1a' ); // First load
				expect( typekitLoad._loading ).toBe( 1 );

				typekitLoad( '1b' ); // Second load
				expect( typekitLoad._loading ).toBe( 2 );
			} );

			it( 'set loading classes', function() {
				typekitLoad( '1a' ); // First load

				expect( this.domclassAdd ).toHaveBeenCalledTwice();
				expect( this.domclassAdd ).toHaveBeenCalledWith( 'wf-loading' );
				expect( this.domclassAdd ).toHaveBeenCalledWith( 'wf-firstload' );
				expect( this.domclassRemove ).not.toHaveBeenCalled();
				this.domclassAdd.reset();

				typekitLoad._first = false;
				typekitLoad( '1b', this.spy(), this.spy() ); // Second load

				expect( this.domclassAdd ).toHaveBeenCalledOnce();
				expect( this.domclassAdd ).toHaveBeenCalledWith( 'wf-loading' );
				expect( this.domclassRemove ).not.toHaveBeenCalled();
				this.domclassAdd.reset();
			} );

			it( 'call loader', function() {
				typekitLoad( 'my-typekit-id' );

				expect( this.loader ).toHaveBeenCalledOnce();
				expect( this.loader.args[ 0 ][ 0 ] ).toMatch( '/my-typekit-id.js' );
				expect( this.loader.args[ 0 ][ 1 ] ).toBeFunction();
				expect( this.loader.args[ 0 ][ 2 ] ).toBe( typekitLoad.timeout );
			} );
		} );

		describe( 'Finish', function() {
			before( function() {
				this.loader = this.stub( window._loadMock, 'load' );
				this.domclassAdd = this.spy( window._domClassMock, 'add' );
				this.domclassRemove = this.spy( window._domClassMock, 'remove' );
				window.Typekit = {
					load: function( obj ) {
						obj.active();
					}
				};
			} );
			
			it( 'decrements loading counter once', function() {
				typekitLoad( '1a' ); // First load
				expect( typekitLoad._loading ).toBe( 1 );

				this.loader.callArg( 1 );
				expect( typekitLoad._loading ).toBe( 0 );
			} );
			
			it( 'decrements loading counter twice', function() {
				typekitLoad( '1b' ); // Second load
				typekitLoad( '1c' ); // third load
				expect( typekitLoad._loading ).toBe( 2 );

				this.loader.callArg( 1 );
				expect( typekitLoad._loading ).toBe( 0 );
			} );
			
			it( 'set not first load', function() {
				typekitLoad( '1b' ); // Second load
				this.loader.callArg( 1 );
				expect( typekitLoad._first ).toBe( false );
			} );
			
			it( 'update classes', function() {
				typekitLoad( '1a' ); // First load

				this.domclassAdd.reset();
				this.domclassRemove.reset();
				this.loader.callArg( 1 );
				expect( this.domclassRemove ).toHaveBeenCalledTwice();
				expect( this.domclassRemove ).toHaveBeenCalledWith( 'wf-loading' );
				expect( this.domclassRemove ).toHaveBeenCalledWith( 'wf-firstload' );
				expect( this.domclassAdd ).not.toHaveBeenCalled();
			} );
			
			it( 'update classes (still loading)', function() {
				typekitLoad( '1a' ); // First load
				typekitLoad( '1a' ); // Second load

				this.domclassAdd.reset();
				this.domclassRemove.reset();
				this.loader.firstCall.callArg( 1 );
				expect( this.domclassRemove ).toHaveBeenCalledOnce();
				expect( this.domclassRemove ).not.toHaveBeenCalledWith( 'wf-loading' );
				expect( this.domclassRemove ).toHaveBeenCalledWith( 'wf-firstload' );
				expect( this.domclassAdd ).not.toHaveBeenCalled();

				this.domclassAdd.reset();
				this.domclassRemove.reset();
				this.loader.secondCall.callArg( 1 );
				expect( this.domclassRemove ).toHaveBeenCalled();
				expect( this.domclassRemove ).toHaveBeenCalledWith( 'wf-loading' );
			} );
		} );

		describe( 'Success', function() {
			before( function() {
				this.loader = this.stub( window._loadMock, 'load' );
				this.domclassAdd = this.spy( window._domClassMock, 'add' );
				this.domclassRemove = this.spy( window._domClassMock, 'remove' );
				window.Typekit = {
					load: function( obj ) {
						obj.active();
					}
				};
			} );
			
			it( 'calls success function on next event loop', function( done ) {
				var success = this.spy();
				var error = this.spy();

				typekitLoad( '1a', success, error ); // First load

				this.loader.callArg( 1 );

				expect( success ).not.toHaveBeenCalled();
				setTimeout( done( function() {
					expect( success ).toHaveBeenCalledOnce();
					expect( error ).not.toHaveBeenCalled();
				} ), 20 );
			} );
		} );

		describe( 'Error', function() {
			before( function() {
				this.loader = this.stub( window._loadMock, 'load' );
				this.domclassAdd = this.spy( window._domClassMock, 'add' );
				this.domclassRemove = this.spy( window._domClassMock, 'remove' );
				this.success = this.spy();
				this.error = this.spy();
				window.Typekit = {
					load: function( obj ) {}
				};
				this.runtypekit = this.stub( window.Typekit, 'load' );
			} );
			
			it( 'adds error class', function() {
				typekitLoad( '1a' );

				this.domclassAdd.reset();
				this.runtypekit.yieldsTo( 'inactive' );
				this.loader.callArg( 1 );

				expect( this.domclassAdd ).toHaveBeenCalledWith( 'wf-inactive' );
			} );
			
			it( 'calls error callback on typekit load fail', function( done ) {
				var success = this.spy();
				var error = this.spy();
				typekitLoad( '1a', success, error );

				this.runtypekit.yieldsTo( 'inactive' );
				this.loader.callArg( 1 );

				expect( error ).toHaveBeenCalled();
				error.reset();
				setTimeout( done( function() {
					expect( success ).not.toHaveBeenCalled();
					expect( error ).not.toHaveBeenCalled();
				} ), 20 );
			} );
			
			it( 'calls error callback on typekit not found', function( done ) {
				var success = this.spy();
				var error = this.spy();
				typekitLoad( '1a', success, error );

				this.runtypekit.throws();
				this.loader.callArg( 1 );

				expect( error ).toHaveBeenCalled();
				error.reset();
				setTimeout( done( function() {
					expect( success ).not.toHaveBeenCalled();
					expect( error ).not.toHaveBeenCalled();
				} ), 20 );
			} );
		} );
	} );

} );
} )( typeof define == 'function'
	? define
	: function( deps, factory ) { factory( this.buster, this.typekitLoad ); }
	// Boilerplate for AMD, and browser global
);