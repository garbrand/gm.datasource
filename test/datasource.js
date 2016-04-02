'use strict';

let DS     = require( '../source/datasource.js' );
let expect = require('chai').expect;

describe( 'Datasource:', () => {
	describe( '(extending Array)', () => {
		let ds = DS();

		it('should be of type Array', () => {
			expect( ds ).to.be.instanceof( Array );
		});

		it('should not expose any custom methods or properties', () => {
			expect( Object.keys( ds ) ).to.eql( Object.keys( new Array() ) );
		});
	});

	describe( '(pub/sub)', () => {
		it('should register functions as subscribers', ( ) => {
			let ds = DS();

			expect( ds.__subscribers.length ).to.equal( 0 );
			ds.subscribe( () => {} );
			expect( ds.__subscribers.length ).to.equal( 1 );
		});

		it('should not register a function twice', () => {
			let ds = DS();
			let fn = () => {};

			ds.subscribe( fn );
			expect( ds.subscribe( fn ) ).to.equal( false );
		});

		it('should unregister functions', () => {
			let ds = DS();
			let fn = () => {};

			ds.subscribe( fn );
			expect( ds.__subscribers.length ).to.equal( 1 );

			ds.unsubscribe( fn );
			expect( ds.__subscribers.length ).to.equal( 0 );
		});

		it('should not register anything else then functions as subscribers', () => {
			let ds = DS();

			expect( ds.subscribe ).to.throw( TypeError );
		});

		it('should call the subscribers when the Datasource changes', ( done ) => {
			let ds = DS();

			ds.subscribe( ( array, item ) => {
				expect( array ).to.eql ( [ 1 ]);
				expect( item ).to.equal( 1 );
				done();
			} );

			ds.push( 1 );
		});
	});

	describe( 'API', () => {
		let state = [ 1, 2, 3 ];
		let change = 4;

		let ds = DS( 1,2,3 );

		it('should return the new state of the Datasource as the first argument and the change as the second', ( done ) => {
			function handler( state, change ) {
				return function( array, item ) {
					expect( array ).to.not.eql( state );
					expect( array ).to.eql( [ 1 , 2 , 3 , 4 ] );
					expect( item ).to.eql( change );
					done();
				}
			}

			expect( ds ).to.eql( state );
			ds.subscribe( handler( state, change ) );
			ds.push( 4 );
		});
	});
} );
