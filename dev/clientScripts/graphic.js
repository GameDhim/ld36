define( 
	["textures"],
	function(textures) {

		var graphics = Object.Create( function Graphics() {}, Object.getOwnPropertyDescriptors(
		{	screenRatio : 4/5
		}

		) 

		graphics.init = function( ) {
			this.initTextures() ; 
			this.initContext() ;
		}

		//load the textures 
		graphics.initTexture() {





		}

		//Get context from the canvas, set up dimension to be sure the canvas is of the correct resolution
		graphics.initContext = function() {
			this.canvas = document.createElement("canvas");
			this.context = canvas.getContext("2d");						
			canvas.width = canvas.scrollWidth;
			canvas.height = canvas.scrollHeight;

			//something something with ratio 

			return this.context ;
		}

		return graphics ;
	}

)