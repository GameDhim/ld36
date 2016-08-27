define( [ "utils" ],
	function( utils ) {
		



		function MESSAGE () {}
		var originalMessage = Object.create( MESSAGE.prototype ,		Object.getOwnPropertyDescriptors(
			{ clearText : ""     		//String: The human readable 
			, encryptedText : ""		//String: The encrypted version before sending it 
			, encryptionUsed : []   //Array of int: sequnce of code used to encrypt it 
			, morseText : ""				//String: the encoded in morse version
			, morseCodeUsed : 0 		//int: 
			}))


		MESSAGE.prototype.render = function( x, y, size ) {
			this.sprite = this.createSprite("message0", 600 ) ;
			sprite = this.sprite ;
			this.graphic.context.drawImage( sprite.buffer.canvas
								 										, sprite[ size ].coordinates.x
																		, sprite[ size ].coordinates.y
																		, sprite[ size ].size.w
																		, sprite[ size ].size.h
																		, x
																		, y
																		, sprite[ size ].size.w
																		, sprite[ size ].size.h
															 			)
		}

		MESSAGE.prototype.createSprite = function( textureName, width ) {			
			var texture = this.graphic.textures[ textureName ]
				, ratio = texture.width / texture.height 
				, sprite = 
					{ buffer : this.graphic.getOffscreenBuffer( width+width/2, width/ratio + width/2/ratio )					
					, big : 
						{	coordinates : { x : 0, y : 0 }
						, size : { w : width , h : width / ratio }				
						}
					, small : 
						{ coordinates : { x : width, y : width / ratio  }
						, size : { w : width/2 , h : width /2 / ratio }			
						}
					}
			
			sprite.buffer.save();	
			sprite.buffer.rotate((Math.PI/180)*5* ( Math.random() - 0.5 )) ;
			sprite.buffer.drawImage( texture
														 , sprite.big.coordinates.x + 10 
														 , sprite.big.coordinates.y + 10/ratio 
														 , sprite.big.size.w - 20
														 , sprite.big.size.h - 20/ratio
														 )

			sprite.buffer.font = "23px Cutive Mono"
			sprite.buffer.fillText("17 / 06 / 1911 ", 40, 56);
			sprite.buffer.font = "32px Great Vibes"
			sprite.buffer.fillStyle = "rgba(30,30,240,0.8)"
			sprite.buffer.fillText( this.clearText , 32, 110);
			
			sprite.buffer.restore();	

			//copy and scale down
			sprite.buffer.drawImage( sprite.buffer.canvas
														 , sprite.big.coordinates.x
														 , sprite.big.coordinates.y
														 , sprite.big.size.w
														 , sprite.big.size.h
														 , sprite.small.coordinates.x
														 , sprite.small.coordinates.y
														 , sprite.small.size.w
														 , sprite.small.size.h
														 )

			return sprite
		}


		//The main object		
		var messageFactory = {} ;
		//Factory function
		messageFactory.createMessage = function( clearText ) {
			var message = Object.create( originalMessage )
			message.clearText = clearText  ; 
			return message ; 
		}
		//Initialise the factory
		//link audio and graphic
		messageFactory.init = function ( graphic, audio ) {
			
			originalMessage.graphic = graphic 
			originalMessage.audio = audio 
			console.log( "graphic :",  originalMessage.graphic 	)
		}
		return messageFactory ;
})