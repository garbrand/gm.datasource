'use strict';

let instances = 0;

function DataSourceFactory() {
	// DataSourceFactory extends Array, and wraps 'push' so it can be used for pub/sub.
	instances++;

	let collection = new Array( ...arguments );

	// TODO: move all this code into a constructor, so we can do the below:
	// collection.prototype.constructor = DataSourceFactory;

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
				// Only register a function once
				return ( collection.__subscribers.indexOf( fn ) > -1 )? false : collection.__subscribers.push( fn );
			}
		},
		'unsubscribe': {
			enumerable: false,
			value: ( fn ) => {
				if( typeof fn !== 'function' ) throw new TypeError('You can only ubsubscribe functions');
				let index = collection.__subscribers.indexOf( fn );
				return ( index > -1 )? collection.__subscribers.splice( index, 1 ) : false;
			}
		},
		'__subscribers': {
			enumerable: false,
			value: []
		}
	});

	return collection;
}

DataSourceFactory.instances = () => instances;

module.exports = DataSourceFactory;
