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
requirejs(['graphic', 'audio',  'telegraph', 'book', "messageFactory", 'jquery', 'materialize' ], 
    function ( graphic, audio, telegraph, book, messageFactory  ) {
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


          messageFactory.init( graphic, audio )
          game.elements.push( messageFactory )

          telegraph.init( graphic, audio )
          game.elements.push( telegraph )

          setTimeout(function() {
            graphic.canvas.setAttribute( "style", "background-image : url(/img/textures/fond.png)" )

            messageFactory.createMessage( "sed Ediam con seguitur").setPosition(30,30, "small") 
            messageFactory.createMessage( "set etidam con papa ").setPosition(50,90, "small") 
            messageFactory.createMessage( "Hello world").setPosition(40,150, "small") 

            periodicRefresh( )         
          }, 100);
          
        }

        var timer = 0 
        function periodicRefresh( ) {          
          if( timer++ % 10 == 0 ) {
            graphic.refresh () 
          }
          window.requestAnimationFrame(periodicRefresh);
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