requirejs.config({
  baseUrl: './scripts',
  paths: {
    requirejs: 'require',
    jquery: 'lib/jquery/dist/jquery',
    jqueryui: 'lib/jquery-ui',
    'materialize': 'lib/materialize/dist/js/materialize',
    'hammerjs':    'lib/materialize/js/hammer.min',
    'jquery-hammerjs':'lib/materialize/js/jquery.hammer'        
  },
  packages: [

  ],
  shim: {
    'materialize': {
      deps: ['jquery', 'hammerjs', 'jquery-hammerjs']
    },
    'jquery': {
      exports: '$'
    },
     "jqueryui": {
      //exports: "$",
      deps: ['jquery']
    }
  }
});

// Start the main app logic.
requirejs(['graphic', 'audio',  'telegraph', 'book', 'jquery', 'materialize' ], 
    function ( graphic, audio, telegraph, book  ) {
      game = {
        state : "loading"
      ,  elements : [] 
      }

      game.render = function(){
        for (var i = 0; i < this.elements.length; i++) {
          this.elements[i].render() 
        }
      }

      function init( ) {

        graphic.onInit = waitForLoadingRessources 
        audio.onInit   = waitForLoadingRessources 
        graphic.init( game ) ; 
        audio.init( game ) ;
                  

      }


      function waitForLoadingRessources( ressource, object ) {
        game[ ressource ] = object ; 
        console.log( ressource +" has loaded ")
        if( game.hasOwnProperty( "graphic") && game.hasOwnProperty( "audio") ) {
          console.log( "Everything is loaded")
          book.init( graphic, audio )
          book.position( 350, 10 ) 
          game.elements.push( book )


          telegraph.init( graphic, audio )
          game.elements.push( telegraph )

          setTimeout(function() {
            game.render() ;            
          }, 100);
          
        }


        // telegraph.init( graphic, audio )
        // book.init( graphic, audio )
        // book.render( 350, 10 ) 
      }

      $( function() { 
        console.log( "init" )
        init() ; 


      } )



    }) ;