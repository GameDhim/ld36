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




	return utils ; 
} 
)