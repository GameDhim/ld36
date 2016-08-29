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
requirejs(['graphic', 'audio',  'telegraph', 'book', "messageFactory", 'messagesList', 'jquery', 'materialize' ], 
    function ( graphic, audio, telegraph, book, messageFactory, messageList  ) {
      game = {
        state : "loading"
      ,  elements : [] 
      , messageInQueue : []
      }

      game.render = function(){
        for (var i = 0; i < this.elements.length; i++) {
          this.elements[i].render() 
        }

      }

      game.verify = function() {
        // /console.log( telegraph.string )
        for( var i in this.messageInQueue ) {
          message = this.messageInQueue[i]
          // console.log( message.morseText, telegraph.string.indexOf( message.morseText ) )
        }


      }

      function init( ) {

        graphic.onInit = waitForLoadingRessources 
        audio.onInit   = waitForLoadingRessources 
        graphic.init( game ) ; 
        audio.init( game ) ;
                  
        setInterval( game.verify.bind( game ) , 1000);
      }

      function messageToSend () {
        var r = Math.floor(Math.random()  * messageList.length )
          , e = messageList.splice( r , 1) 
        


        m = messageFactory.createMessage( e[0], telegraph.code( e[0] ) ).setPosition(450+ Math.random() * 30 ,30 + Math.random() * 30 , "small") 

       

  
        game.messageInQueue.push( m )
      }

      function messageToReceive () {
        var r = Math.floor(Math.random()  * messageList.length )
          , e = messageList.splice( r , 1)         
        telegraph.play( telegraph.code2( e[0]))
      }

      function messageInOrOut( ) {
        if( Math.random() > 0.5 ) {
          messageToSend()
        } else {
          messageToReceive()
        }
        if( messageList.length > 0 )
          setTimeout(messageInOrOut, ( Math.random()  +  Math.random() )  * 10000 + 5000 );

      }

      function waitForLoadingRessources( ressource, object ) {
        game[ ressource ] = object ; 
        console.log( ressource +" has loaded ")
        if( game.hasOwnProperty( "graphic") && game.hasOwnProperty( "audio") ) {
          console.log( "Everything is loaded")
           
          book.init( graphic, audio )
          book.position( 750, 10 ) 
          game.elements.push( book )


          messageFactory.init( graphic, audio )
          game.elements.push( messageFactory )

          telegraph.init( graphic, audio )
          game.elements.push( telegraph )

          setTimeout(function() {
            graphic.canvas.setAttribute( "style", "background-image : url(/img/textures/fond.png)" )

            messageFactory.createMessage( "").setPosition(220-120,30, "small") 
            messageFactory.createMessage( "").setPosition(190-120,90, "small") 
            messageFactory.createMessage( "").setPosition(175-120,60, "small") 

            messageInOrOut()

            periodicRefresh( )         
          }, 2000);
          
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