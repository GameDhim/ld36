define( 
	[ "textures", "utils"],
	function(textures) {
		function Graphics() {}
		var graphics = Object.create( Graphics.prototype , Object.getOwnPropertyDescriptors(
		{	screenRatio : 4/5
		,	textures : {}
		, loading : 0 	
		, elements : []
		}

		) )

		graphics.init = function( ) {
			this.initTextures() ; 
			this.initContext() ;
			this.elements.push( this )
			this.canvas.addEventListener( "click", clickHandler.bind( this ) )

			 
			return this ; 
		}
		graphics.click = function( ) {
			console.log( "click au fond de l'écran" ) ;
		}

		function clickHandler( e ) {
				console.log( "click", e.layerX, e.layerY )
				data = this.contextUI.getImageData( e.layerX, e.layerY, 1, 1).data ;
				console.log( data )
				if( this.elements[ data[0] ]) this.elements[data[0]].click( data[0], data[1], data[2], e)
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
				this.initDone() 
		}

		//Get context from the canvas, set up dimension to be sure the canvas is of the correct resolution
		graphics.initContext = function() {
			this.canvas = document.getElementById("canvas");
			this.context = this.canvas.getContext("2d");						
			this.canvas.width = this.canvas.scrollWidth;
			this.canvas.height = this.canvas.scrollHeight;

			//something something with ratio 
			this.canvasUI = document.createElement("canvas");
			this.contextUI = this.canvasUI.getContext("2d");						
			this.canvasUI.width = this.canvas.scrollWidth;
			this.canvasUI.height = this.canvas.scrollHeight;

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

	

		return graphics ;
	}

)