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

      function init( ) {

        graphic.initDone = waitForLoadingRessources 
        graphic.init() ; 
        audio.init() 
          
        
        

      }


      function waitForLoadingRessources( ) {
        telegraph.init( graphic, audio )
        book.init( graphic, audio )
        book.render( 350, 10 )
      }

      $( function() { 
        console.log( "init" )
        init() ; 


      } )



    }) ;