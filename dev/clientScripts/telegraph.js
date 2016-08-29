define( ["messageFactory"],
	function( messageFactory ) {

		var telegraph = {
			position : { x : 0, y : 0 }
		,	state : "up"

		}


		//Initialize the telegraph 
		telegraph.init = function( graphic, audio ) {
			this.graphic = graphic ; 
			this.audio = audio ; 			
			
			this.uiColor = this.graphic.registerUIelement( this ) ; 

			texture = this.graphic.textures[ "telegraph_" + this.state ]
			this.sprite = []
			this.sprite["up"] = this.graphic.getOffscreenBuffer( texture.width/2, texture.height/2 )
			this.sprite["down"] = this.graphic.getOffscreenBuffer( texture.width/2, texture.height/2 )
			this.sprite["up"]   .drawImage( this.graphic.textures[ "telegraph_up"]  , 0, 0, texture.width, texture.height, 0, 0, texture.width/2, texture.height/2   )
			this.sprite["down"] .drawImage( this.graphic.textures[ "telegraph_down"], 0, 0, texture.width, texture.height, 0, 0, texture.width/2, texture.height/2   )


			this.uiSprite = this.graphic.getOffscreenBuffer( texture.width/2, texture.height/2 )			
			this.uiSprite.fillStyle = this.graphic.rgb( this.uiColor.r, 0, 0 )
			this.uiSprite.fillRect( 0, 0, texture.width, texture.height )
			this.uiSprite.globalCompositeOperation = "destination-in"
			this.uiSprite.drawImage( texture, 0, 0, texture.width, texture.height, 0, 0, texture.width/2, texture.height/2   )
			this.uiSprite.globalCompositeOperation = "lighter"
			this.uiSprite.drawImage(  this.graphic.textures[ "telegraph_button"  ], 0, 0, texture.width, texture.height, 0, 0, texture.width/2, texture.height/2   )

		}



		telegraph.render = function() {
			this.graphic.context.drawImage( this.sprite[ this.state ].canvas, this.position.x, this.position.y )
			this.graphic.contextUI.drawImage( this.uiSprite.canvas , this.position.x, this.position.y )

		}
		//take a message a play the di da di daa corresponding
		telegraph.play = function ( message ) {
			
		}

		telegraph.click = function( r, g, b ) {
			if( this.previous == "click") {
				this.state = "down"
				this.graphic.refresh() ;
				//If press is so short fake a press
				//this.audio.shortBip() 
				setTimeout(function() {
					console.log( "fake")
					this.state = "up"
					this.graphic.refresh() ;
				}.bind( this ) , 100);
			}
			this.previous = "click"
			
			
		}
		telegraph.drag =function( r,g,b, state, dx, dy) {
			if( g == 255 ) {
				this.state = ( state =="end") ? "up" : "down"
				this.graphic.refresh() ;

				if( state == "continue") {
					this.previous = "longPress"
				} else if( state == "start") {
					this.audio.startBip()
					this.start = this.audio.currentTime 
				} else if( state == "end" ){
					this.audio.stopBip()
				}
				return true 
			} else {
				if( state == "continue"){
					this.position.x += dx ;
					this.position.y += dy ;
				}
				return true
			}

		}

		var code = {
			a:".-" ,
			b:"-...",
			c:"-.-.",
			d:"-..",
			e:".",
			f:"..-.",
			g:"--.",
			h:"....",
			i:"..",
			j:".---",
			k:"-.-",
			l:".-..",
			m:"--",
			n:"-.",
			o:"---",
			p:".--.",
			q:"--.-",
			r:".-.",
			s:"...",
			t:"-",
			u:"..-",
			v:"...-",
			w:".--",
			x:"-..-",
			y:"-.--",
			z:"--.",
			0:"-----",
			1:".----",
			2:"..---",
			3:"...--",
			4:"....-",
			5:".....",
			6:"-....",
			7:"--...",
			8:"---..",
			9:"----."
		}

		return telegraph 
	})


