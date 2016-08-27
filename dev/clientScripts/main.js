requirejs.config({
  baseUrl: './scripts',
  paths: {
    requirejs: 'require',
    jquery: 'lib/jquery/dist/jquery',
    jqueryui: 'lib/jquery-ui',
    'materialize': 'lib/Materialize/dist/js/materialize',
    'hammerjs':    'lib/Materialize/js/hammer.min',
    'jquery-hammerjs':'lib/Materialize/js/jquery.hammer'        
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
requirejs(['graphic', 'audio',  'telegraph', 'jquery', 'materialize' ], 
    function ( graphic, audio, telegraph ) {

      function init( ) {

        graphic.initDone = waitForLoadingRessources 
        graphic.init() ; 
        audio.init() 
          
        
        

      }


      function waitForLoadingRessources( ) {
        telegraph.init( graphic, audio )

      }

      $( function() { 
        console.log( "init" )
        init() ; 


      } )



    }) ;