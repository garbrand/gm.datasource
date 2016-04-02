'use strict';

module.exports = function DataSourceFactory() {

	// TODO: move all this code into a constructor, so we can do the below:
	// collection.prototype.constructor = DataSourceFactory;

	// DataSourceFactory extends Array, and wraps 'push' so it can be used for pub/sub.
	let collection = new Array( ...arguments );

	// Mixing in custom methods to Array:
	Object.defineProperties( collection, {
		'push': {
			enumerable: false,
			value: (data) => {
				// Add data to the datasource
				Array.prototype.push.call( collection, data );

				// Call each subscriber with the new collection & data
				collection.__subscribers.forEach( (fn) => fn( collection, data ) );
			}
		},
		'subscribe': {
			enumerable: false,
			value: ( fn ) => {
				if( typeof fn !== 'function' ) throw new TypeError('You can only subscribe functions');
				collection.__subscribers.push( fn );
			}
		},
		'__subscribers': {
			enumerable: false,
			value: []
		}
	});

	return collection;
}
