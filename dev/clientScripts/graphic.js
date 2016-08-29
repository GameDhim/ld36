define( 
	[ "textures", "utils"],
	function(textures) {
		function Graphics() {}
		var graphics = Object.create( Graphics.prototype , Object.getOwnPropertyDescriptors(
		{	screenRatio : 4/5
		,	textures : {}
		, loading : 0 	
		, elements : [] 	//The graphical elements 
		, dragOn : false 
		}

		) )

		graphics.init = function( game ) {
			//reference to the game 
			this.game = game ; 

			
			

			this.initTextures() ; 
			this.initContext() ;
			
			//To catch any click on the background 
			this.elements.push( this )

			window.addEventListener( "resize", this.initContext.bind( this ))
			this.canvas.addEventListener( "click", clickHandler.bind( this ) )
			this.canvas.addEventListener( "mousedown", mouseDown.bind( this ) )
			this.canvas.addEventListener( "mousemove", drag.bind( this ) )
			this.canvas.addEventListener( "mouseup", mouseUp.bind( this ) )
			 
			return this ; 
		}
		graphics.click = function( ) {
			console.log( "click au fond de l'écran" ) ;
		}

		//THis fonction add an element and return the color that can be used
		//WHat ? how is this not clear!...
		graphics.registerUIelement =function( element ) {
			this.elements.push( element )
			if( this.elements.length > 255 ) console.error( "too many elements")
			return {r : this.elements.length -1 , g:0, b:0 }  ;  
		}

		function clickHandler( e ) {				
				var data = this.contextUI.getImageData( e.layerX, e.layerY, 1, 1).data ;				
				if( this.elements[ data[0] ]) this.elements[data[0]].click( data[0], data[1], data[2], e)
		}
		
		
		function mouseDown( e ) {
			
			var data = this.contextUI.getImageData( e.layerX, e.layerY, 1, 1).data 				
				, initDrag = false 
				, element = this.elements[ data[0] ]
			if( element && element.drag ) {			
				initDrag = element.drag( data[0], data[1], data[2], "start", e.layerX, e.layerY )
			}
			if( initDrag ) { 
				this.dragOn = true 
				this.dragElement = this.elements[data[0]]
				this.dragLastPosition = 
					{ x:e.layerX
					, y: e.layerY 
					} 
			}
		}
		function drag( e ) {						
			if( this.dragOn ) {
					var data = this.contextUI.getImageData( e.layerX, e.layerY, 1, 1).data 		
				, element = this.elements[ data[0] ]
				// if( element != this.dragElement ) {
				// 	this.dragOn = false 
				// 	return this.dragElement .drag( data[0], data[1], data[2], "end", e.layerX, e.layerY )
				// } 

				this.dragElement.drag( data[0], data[1], data[2], "continue", e.layerX - this.dragLastPosition.x, e.layerY  - this.dragLastPosition.y )
				this.dragLastPosition = 
					{ x:e.layerX
					, y: e.layerY 
					} 
			}
		}
		function mouseUp( e ) {

			if( this.dragOn ) {
					var data = this.contextUI.getImageData( e.layerX, e.layerY, 1, 1).data 		
				, element = this.elements[ data[0] ]

				this.dragElement.drag( data[0], data[1], data[2], "end", e.layerX, e.layerY )
				this.dragLastPosition = 
					{ x:e.layerX
					, y: e.layerY 
					} 
				this.dragOn = false 
			}
		}

		//load the textures 
		graphics.initTextures = function() {
			for( var i in textures ) {
				//If this is an url load the texture
				if( typeof textures[i] == "string" ) {					
					this.loadTexture( i, textures[i] )
				} else {
					for( var j in textures[i] ) {
						this.loadTexture( i+j, textures[i][j] ) ;
					}
				}
			}
		}

		graphics.rgb = function( r, g, b ) {
			return "rgb("+r+","+g+","+b+")"
		}

		//create an image for the texture and async load id 
		graphics.loadTexture = function( name, url ) { 
			this.textures[ name ] = new Image() 
			this.textures[ name ].src = url ;
			this.loading ++
			this.textures[ name ].addEventListener( "load", imgLoaded.bind( this ) )
		}

		function imgLoaded () {
			this.loading-- 
			if( this.loading == 0 ) 
				this.onInit( "graphic", this ) 
		}

		//Get context from the canvas, set up dimension to be sure the canvas is of the correct resolution
		graphics.initContext = function() {

			var height = window.innerHeight 
			var width = document.body.clientWidth


			this.canvas = document.getElementById("canvas");
			this.context = this.canvas.getContext("2d");						
			this.canvas.width = width //this.canvas.scrollWidth;
			this.canvas.height = height // this.canvas.scrollHeight;

			//something something with ratio 
			this.canvasUI = document.createElement("canvas");
			this.contextUI = this.canvasUI.getContext("2d");						
			this.canvasUI.width = this.canvas.scrollWidth;
			this.canvasUI.height = this.canvas.scrollHeight;

			this.refresh()
			return this.context ;
		}

		//Get context from the canvas, set up dimension to be sure the canvas is of the correct resolution
		graphics.getOffscreenBuffer = function( width, height ) {
			var canvas = document.createElement("canvas")
				, offscreenBuffer = canvas.getContext("2d")
				;						

		  offscreenBuffer.canvas.width = width ;
			offscreenBuffer.canvas.height = height;

			return offscreenBuffer
		}

		graphics.refresh = function( ) {
			this.context.clearRect( 0, 0, this.canvas.width, this.canvas.height )
			this.contextUI.clearRect( 0, 0, this.canvas.width, this.canvas.height )
			game.render() ; 
		}

		return graphics ;
	}

)