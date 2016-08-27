//================================================================
//Express utility functions
//================================================================
module.exports = 
{	
	//take two callback functions and their optional args, return a function that take an potential error, data 
	//if there is no error, then it calls the first callback with the arguments and the return data in last position
	//if there is an error call the second callback with the error first and then the arguments
	wrapProcess : function( callBackSuccess, callBackError, ...args ) {
	  return ( err, data ) => { 
	    if( err ) 
	      callBackError.apply(this, (args.unshift( err ), args ) ) ; 
	    else 
	      callBackSuccess.apply( this, (args.push( data ), args )  ) ;
	  } 
	}
	//print listening port
,	successListen : function () {
	  console.log('listening on *:' + this.address().port ) ; 
	}
}