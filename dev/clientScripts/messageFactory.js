define( [ "utils" ],
	function( utils ) {
		



		function MESSAGE () {}
		var originalMessage = Object.create( MESSAGE.prototype ,		Object.getOwnPropertyDescriptors(
			{ clearText : ""     		//String: The human readable 
			, encryptedText : ""		//String: The encrypted version before sending it 
			, encryptionUsed : []   //Array of int: sequnce of code used to encrypt it 
			, morseText : ""				//String: the encoded in morse version
			, morseCodeUsed : 0 		//int: 
			, position : 
				{	x : 0 
				,	y : 0
				, size : "big" 
				} 
			}))

		
		originalMessage.setPosition = function( x, y, size ) {
			if( !this.hasOwnProperty( "position" ) ) this.position = 
				{	x : 0 
				,	y : 0
				, size : "big" 
				} 
			this.position.x = x 
			this.position.y = y 

			if( size !== undefined ) this.position.size = size 
			return this
		}

		MESSAGE.prototype.render = function(  ) {			
			var sprite = this.sprite 				
				, size = this.position.size 
			

			this.graphic.context.save()
				this.graphic.context.rotate( sprite.angle ) ;			
				this.graphic.context.drawImage( sprite.buffer.canvas
									 										, sprite[ size ].coordinates.x
																			, sprite[ size ].coordinates.y
																			, sprite[ size ].size.w
																			, sprite[ size ].size.h
																			, this.position.x
																			, this.position.y
																			, sprite[ size ].size.w
																			, sprite[ size ].size.h
																 			)
			this.graphic.context.restore()

			this.graphic.context.save()
			{
				this.graphic.context.translate( this.position.x
																			, this.position.y )
				if( this.position.size == "small")
					this.graphic.context.scale(0.5,0.5)
				this.graphic.context.rotate( sprite.angle ) ;
				this.graphic.context.font = "23px Cutive Mono"
				this.graphic.context.fillText("17 / 06 / 1911 ", 40, 56);
				
				this.graphic.context.font = "32px Great Vibes"
				this.graphic.context.fillStyle = "rgba(30,30,240,0.8)"
				this.graphic.context.fillText( this.clearText , 40, 110);
			}
			this.graphic.context.restore()

			this.graphic.contextUI.drawImage( sprite.bufferUI.canvas
								 										, sprite[ size ].coordinates.x
																		, sprite[ size ].coordinates.y
																		, sprite[ size ].size.w
																		, sprite[ size ].size.h
																		, this.position.x
																		, this.position.y
																		, sprite[ size ].size.w
																		, sprite[ size ].size.h
															 			)
		}

		MESSAGE.prototype.createSprite = function( textureName, width ) {			
			var texture = this.graphic.textures[ textureName ]
				, ratio = texture.width / texture.height 
				, height = width/ratio
				
				, sprite = this.sprite || 
					{ buffer : this.graphic.getOffscreenBuffer( width+width/2 , height  + height/2  )				
					,	bufferUI	: this.graphic.getOffscreenBuffer( width+width/2, height + height/2 )								
					, angle : this.sprite || (Math.PI/180)* 5*( Math.random() - 0.5 )			
					, big : 
						{	coordinates : { x : 0, y : 0 }
						, size : { w : width , h : height  }				
						}
					, small : 
						{ coordinates : { x : 0, y : height}
						, size : { w : (width)/2, h : (height )/2}
						}
					}
			
			sprite.buffer.save();	
				{
					
					sprite.buffer.save();	

					
					
					sprite.buffer.drawImage( texture
																 , 0
																 , 0
																 , sprite.big.size.w
																 , sprite.big.size.h
																 )
					
		
					
					
					
					sprite.buffer.restore();	
					sprite.buffer.save();						
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
					sprite.buffer.restore();	
			}
			sprite.buffer.restore();	

			sprite.bufferUI.fillStyle = this.graphic.rgb( this.uiColor.r , this.uiColor.g , this.uiColor.b ) 			
			
			sprite.bufferUI.fillRect( 0, 0, width+width/2, width/ratio + width/2/ratio )
			sprite.bufferUI.globalCompositeOperation = "destination-in"
			sprite.bufferUI.drawImage( sprite.buffer.canvas, 0, 0 )

			window.sprite = sprite 

			this.sprite = sprite ;
			return sprite
		}




		//The main object		
		var messageFactory = {
			messages : []
		, order : [] 
		} ;
		//Factory function


		messageFactory.createMessage = function( clearText, morseText ) {
			var message = Object.create( originalMessage )
			this.messages.push( message )
			this.order.unshift( 	this.messages.length -1  )

			message.clearText = clearText ; 
			message.morseText = morseText ;


			message.uiColor = {r : originalMessage.uiColor.r, g : this.messages.length , b : 0 }

			message.createSprite( "message0" , 600)

			message.setPosition( 30, 30 + Math.floor( Math.random( ) * 300  ) ) 
			
			return message ; 
		}
		//Initialise the factory
		//link audio and graphic
		messageFactory.init = function ( graphic, audio ) {
			
			originalMessage.graphic = graphic 
			originalMessage.audio = audio 
			originalMessage.uiColor = graphic.registerUIelement( this ) ; 
			
		}
		
		messageFactory.render =function( ) {
			//draw each message in order
			for (var i = this.messages.length - 1; i >= 0; i--) {
				this.messages[ this.order[ i ] ].render() 
			}
		}
		messageFactory.click = function( r, g, b, event ) {
			
			message = this.messages[ g-1 ] 
			if( message !== undefined) {
				message.position.size =  ( message.position.size == "big")  ? "small" : "big" ;
				message.graphic.refresh()
			}

		}
		messageFactory.drag = function(r,g,b, state, dx, dy  ) {
			var index = g-1 
				, message = this.messages[ index ] 
			

			if( message !== undefined) {														
				if( state == "start") {
					

					var ind = this.order.splice( this.order.indexOf( index) , 1 )
					this.order.unshift( ind[0] )
					
					message.graphic.refresh()
				}
				if( state == "continue") {				
					message.position.x += dx 
					message.position.y += dy
					message.graphic.refresh()
					message.drag = true 				
				}
				if( state == "end") {				
					//inverse so that the click tht follow the end let the image in the same state
					if( message.drag )
						message.position.size =  ( message.position.size == "big")  ? "small" : "big" ;	
					message.drag = false
				}
				return true ;
			}
		}
		return messageFactory ;
})