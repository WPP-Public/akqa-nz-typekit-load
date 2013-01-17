# typekit-load [![Build Status](https://secure.travis-ci.org/heyday/typekit-load.png)](http://travis-ci.org/heyday/typekit-load)

An asynchronous Typekit loader that gives you success and error callback functions, styling hooks via classes on your HTML tag, and times out if the CDN goes down. **typekit-load** has a full unit test suite that passes in all popular browsers (and some not so popular browsers including IE6+), and is **under 720bytes** (including dependencies) when compiled with Uglify2 and gzipped.

This library is made to be as small as possible so it can be inlined into the head of your `<html>` tag to initialise the loading of your fonts before even your css loads. **typekit-load** depends on the [async-load](https://github.com/heyday/async-load) and [dom-class](https://github.com/heyday/dom-class) libraries, these will be automatically installed with Bower or are included with the minified file.


## Quick Start

Three options are available for getting the source:

* [Download the latest release](https://github.com/heyday/typekit-load/zipball/master).
* Clone the repo: `git clone git://github.com/heyday/typekit-load.git`.
* Install with [Bower](http://twitter.github.com/bower): `bower install typekit-load`.

### AMD

1. Configure your loader with a package:

	```javascript
	packages: [
		{ name: 'typekit-load', location: 'path/to/typekit-load/', main: 'load' },
		// ... other packages ...
	]
	```

1. `define( [ 'typekit-load', ... ], function( typekitLoad, ... ) { ... } );` or `require( [ 'typekit-load', ... ], function( typekitLoad, ... ) { ... } );`

### Script Tag

1. `<script src="path/to/typekit-load/load.min.js"></script>`
1. `typekit-load` will be available as `window.typekitLoad`


## API

```javascript
typekitLoad( 'my-typekit-id', mySuccessFunction, myErrorFunction );
```

### Basic load
To load a Typekit font kit, you simply call the `typekitLoad` function passing in the Typekit ID.

###### AMD environment:
```javascript
define( [ 'typekit-load' ], function( typekitLoad ) {
	typekitLoad( 'my-typekit-id' );
} );
```

###### Browser global:
```javascript
window.typekitLoad( 'my-typekit-id' );
```

### Load with success callback
The second argument accepts a callback function which will be called when the font kit has successfully downloaded and initialised.

```javascript
typekitLoad( 'my-typekit-id', function() {
	// Typekit has downloaded and initialised successfully
} );
```

### Load with error callback
The third argument accepts a callback function which will be called when the font set has failed to download, initialise or has timed out.

```javascript
typekitLoad( 'my-typekit-id', mySuccessFunction, function() {
	// Typekit failed to download or initialise
} );
```

### HTML classes
In order to control and style your page based on the load status of the font kit, specific classes are added onto the page's `<html>` tag.

###### On start:
```javascript
// When loading starts it adds class of `wf-loading` and
// `wf-firstload` to html tag if first typekit id to be loaded
typekitLoad( 'my-typekit-id', mySuccessFunction, myErrorFunction );
```

###### On success:
```javascript
// On success
mySuccessFunction = function() {
	// Removes `wf-loading` and `wf-firstload` classes
};
```

###### On error:
```javascript
// On error
myErrorFunction = function() {
	// Removes `wf-loading` and `wf-firstload` classes
	// Adds `wf-inactive` class
};
```

### Timeout
After **2 seconds**, if a font kit is not loaded the loader will time out and call the error callback. If you would like to customise this time out value you can via the `typekitLoad.timeout` property. Setting this property to `null` will remove the timeout.

```javascript
typekitLoad.timeout = 3000; // In milliseconds

typekitLoad( 'my-typekit-id', mySuccessFunction, function() {
	// Typekit failed to download, initialise, or timed out
} );
```

## Development

### Running the unit tests

1. `npm install` - Install all required dev modules
1. `npm install -g grunt-cli` - Install Grunt
1. `grunt test` - Lints all files, and then runs the unit tests in a PhantomJS instance

### Building the module locally

1. `npm install` - Install all required dev modules
1. `npm install -g grunt-cli bower` - Install Grunt and Bower
1. `bower install` - Install all required dependencies
1. `grunt build` - Runs all tests, and then builds the production file
