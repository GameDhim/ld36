define( 
	[ "textures", "utils"],
	function(textures) {
		function Graphics() {}
		var graphics = Object.create( Graphics.prototype , Object.getOwnPropertyDescriptors(
		{	screenRatio : 4/5
		,	textures : {}
		, loading : 0 	
		}

		) )

		graphics.init = function( ) {
			this.initTextures() ; 
			this.initContext() ;
			 
			return this ; 
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