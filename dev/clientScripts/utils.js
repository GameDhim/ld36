//This files define the utils object, that contains all the stupid javascript functions to hack stuff 
//Plus it defines some polyfill that should be implemented 
define( 
[],
function() {
	utils = {} 

	console.log( "utils ")
	//transform an object in its property descriptions 
	if (!Object.hasOwnProperty('getOwnPropertyDescriptors')) {
	  Object.defineProperty(
	    Object,
	    'getOwnPropertyDescriptors',
	    {
	      configurable: true,
	      writable: true,
	      value: function getOwnPropertyDescriptors(object) {
	        return Reflect.ownKeys(object).reduce((descriptors, key) => {
	          return Object.defineProperty(
	            descriptors,
	            key,
	            {
	              configurable: true,
	              enumerable: true,
	              writable: true,
	              value: Object.getOwnPropertyDescriptor(object, key)
	            }
	          );
	        }, {});
	      }
	    }
	  );
	}

	AudioContext.prototype.connectToMultiple = function ( a, mult ) {
		if( mult.length ) {
			for( var i in mult ) {
			
				a.connect( mult[i] )
			}
		} else {
			
			a.connect( mult )
		}

	}

	 AudioContext.prototype.attach =function() {

		prev = false
		for( var i in arguments ) {			
			if( prev ) {
				if( prev.length ) {
					for( var j in prev ) {
						this.connectToMultiple( prev[j], arguments[i] )
					}
				} else {
					this.connectToMultiple( prev, arguments[i] ) ;
				}

			}
			prev = arguments[i] ;			
		}
		//if( prev ) prev.connect( arguments[i]) 
	}

	Math.random2 = function( median, spread ) {

		r1 = Math.random ()
		r2 = Math.random ()

		return median + (r1 + r2 - 1) / 2 * spread 

	}

	Math.randomInt = function( min, max ) {
		return Math.floor( min + (max - min ) * Math.random() ) ;
	}


	return utils ; 
} 
)