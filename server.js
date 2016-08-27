var config      = require( './config' )  //Load config, such as port and db information
  , express     = require( 'express' )
  , app         = express()
  , http        = require( 'http' ).Server( app ) ;   

//utils function for express
var httpUtils = require('./serverScripts/httpUtils')
var applicationName = require('./package.json').name  

//IN DEBUG MODE, use morgan to log information
if( config.DEBUG ) {
  var morgan      = require('morgan') //debug tool}
  app.use( morgan( 'dev' ) );
  console.log( process.env )
}




//Serve bower javacript libs 
app.use( '/scripts/lib/', express.static( 'bower_components' ) ); 
//Serve static files
app.use( express.static( 'dist' ) );    

//template engine
app.set('view engine', 'pug');

//start the server
http.listen( config.port, httpUtils.successListen );

//Serve the index page
app.get("/", renderIndex ) ; 




//
function renderIndex( request, response ) {
  response.render( "pages/index",  { title : applicationName } )
}