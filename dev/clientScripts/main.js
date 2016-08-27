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
requirejs(['ui', 'audio',  'telegraph', 'jquery', 'materialize' ], 
    function ( ui, audio, telegraph ) {

      function init( ) {

        //ui.init() ; 
        audio.init() 
        telegraph.init( ui, audio )


      }

      $( function() { 
        console.log( "init" )
        init() ; 


      } )



    }) ;