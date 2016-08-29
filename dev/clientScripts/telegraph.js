define( [ "code"],
	function(code ) {

		var telegraph = {
			position : { x : 0, y : 350 }
		,	state : "up"
		, string : "" 
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
			if( this.audio.currentTime - this.start < 0.150 ) {
				//press was too short 
				this.state = "down"
				this.graphic.refresh() ;				
				setTimeout(function() {
					
					this.state = "up"
					this.graphic.refresh() ;
					this.audio.stopBip() 
				}.bind( this ) , 100);
			}
			this.previous = "click"						
		}
		telegraph.drag =function( r,g,b, state, dx, dy) {
			//IF CLICK ON THE BUTTON
			if( g == 255 ) {				
				this.state = ( state =="end") ? "up" : "down"
				this.graphic.refresh() ;

				if( state == "start") {
					this.audio.startBip()
					this.start = this.audio.currentTime 		
					
					//if ( (this.start - this.end ) > .700 ) this.string += " "
					if ((this.start - this.end) > 3.000 ) {
						this.string = ""
					}
				} else if( state == "end" ){
					this.audio.stopBip()
					this.string += ( this.audio.currentTime - this.start < 0.150 ) ? "." : "-"
					
					this.end = this.audio.currentTime 
				}
			//DRAG
			} else {
				if( state == "continue"){
					this.position.x += dx ;
					this.position.y += dy ;
				}
			
			}
			return true 
		}

		telegraph.code =function( clearText ) {
			var morse = "" 
			text = clearText.toLowerCase()
			for( var i in clearText ) {
				if( text[i] == " ") continue ;
				morse+= code[ text[ i ]]
			}
			return morse
		}
		telegraph.code2 =function( clearText ) {
			var morse = "" 
			text = clearText.toLowerCase()
			for( var i in clearText ) {
				if( text[i] == " ") {
					morse+= " " ;
					continue 
				}
				morse+= code[ text[ i ]]
			}
			return morse
		}

		telegraph.play = function( morseString ) {
			baseT = this.audio.currentTime ; 
			
			var length = 100 ;
			for( var i in morseString ) {

				switch( morseString[ i ]) {
					case "." : length = 100 * Math.random2( 1, 0.04) ; break ;
					case "-" : length = 600 * Math.random2( 1, 0.04) ; break ; 
					case " " : length = 550 * Math.random2( 1, 0.04) ; break ;
				}
				
				if( morseString[i] != " " ) this.audio.play( baseT, length/1000 )
				baseT += (length + 200)/1000
			}

		}



		return telegraph 
	})


