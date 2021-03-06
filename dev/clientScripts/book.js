define( [ "code", "utils"],
	function ( code ) {
		function BOOK() {	}
		var book = Object.create( BOOK.prototype, Object.getOwnPropertyDescriptors(
		{ pages : [] 
		, pageActive : 0 
		, sprite : null
		, allSprite : null //for ui stuff 
		, size : 433 
		}
		))

		function PAGE() {}
		var protoPage  = Object.create( PAGE.prototype, Object.getOwnPropertyDescriptors(
		{ name : ""
		, textureName : "notebookcover"
		, textureCoordinates : { x: 0, y: 0, w: 0, h: 0}
		, book : book  //There is only one book!
		}
		))

		var temporaryCanvas ;


		protoPage.init = function( book, index  ) {
			this.book = book ; //There is only one book! but maybe...
			this.index = index ;


			var texture = this.book.graphic.textures[ this.textureName ]
				, ratio = texture.width / texture.height 
				, intercalaire =  ( this.intercalaire ) ? this.book.graphic.textures[ "intercalaire" ] : false 

			this.textureCoordinates = { x : index * ( this.book.size + 20 )
																, y : 0 
																, w : this.book.size + 20 
																, h : this.book.size / ratio }
			if( !this.angle )this.angle = (Math.PI/180)* 1 * ( Math.random() - 0.5 )

			//alias
			//prepare the sprite for rendering
			var context = this.book.sprite ; 

			if( !temporaryCanvas ) 
				temporaryCanvas = this.book.graphic.getOffscreenBuffer(  this.textureCoordinates.w ,  this.textureCoordinates.h  )
			

			temporaryCanvas.save() 
			{
				temporaryCanvas.globalCompositeOperation = "source-over"
				temporaryCanvas.clearRect( 0, 0 , this.textureCoordinates.w , this.textureCoordinates.h )
				draw( temporaryCanvas, texture, this.textureCoordinates, intercalaire, index )
				temporaryCanvas.save() 
				{
					temporaryCanvas.globalCompositeOperation = "source-in"
					temporaryCanvas.fillStyle = "rgba(0,0,0," +( Math.abs(index - this.book.pageActive )/5)+")"
					temporaryCanvas.fillRect(0,0,this.textureCoordinates.w ,this.textureCoordinates.h )
					temporaryCanvas.globalCompositeOperation = "destination-over"
					draw( temporaryCanvas, texture, this.textureCoordinates, intercalaire, index )
				}
				temporaryCanvas.restore()
				
				temporaryCanvas.translate( this.textureCoordinates.w - 21 -20 + 5 , (index-1)*111 + 40 )
				temporaryCanvas.rotate( Math.PI / 2  )
				temporaryCanvas.font = "20px Cutive Mono"
				temporaryCanvas.fillText(  this.name, 10, 0 );
			}
			temporaryCanvas.restore() 

			context.save() ;
			{
				context.translate( this.textureCoordinates.x + 10, this.textureCoordinates.y + 10 )
				context.rotate( this.angle )			
				context.drawImage( temporaryCanvas.canvas, 0, 0 )
			}
			context.restore() ; 
			

			
			temporaryCanvas.clearRect( 0, 0 , this.textureCoordinates.w , this.textureCoordinates.h )
			temporaryCanvas.globalCompositeOperation = "source-over"
			draw( temporaryCanvas, texture, this.textureCoordinates, intercalaire, index  )
			
			temporaryCanvas.fillStyle = this.book.graphic.rgb( this.book.graphic.elements.length, 0, 0 )
			temporaryCanvas.globalCompositeOperation = "source-in"
			temporaryCanvas.fillRect( 0, 0 , this.textureCoordinates.w , this.textureCoordinates.h )



			var context2 = this.book.uiSprite ; 
			context2.save() ;		
			context2.translate( this.textureCoordinates.x + 10, this.textureCoordinates.y + 10 )
			context2.rotate( this.angle )			
			context2.drawImage( temporaryCanvas.canvas, 0, 0 )
			context2.restore() ; 




			

			this.book.graphic.elements.push( this )

		}

		protoPage.click = function( redChannel, greenChannel, blueChannel ) {
			
			this.book.click( this.index )
		}

		protoPage.drag = function(r,g,b, state, dx, dy  ) {
			var r =  this.book.drag( this.index, state, dx, dy )			
			return r
		}


		function draw( context, texture, textureCoordinates, intercalaire, index) {			

			context.drawImage( texture, 0,0, textureCoordinates.w - 20 - ((intercalaire)? 20:10), textureCoordinates.h - 20  )
			if(  intercalaire ) context.drawImage( intercalaire, textureCoordinates.w - 21 -20, (index-1)*111 + 40 , 20, 100 )
			
		}



		protoPage.render = function( x, y ) {

			this.book.graphic.context.drawImage( this.book.sprite.canvas
																				 , this.textureCoordinates.x
																				 , this.textureCoordinates.y
																				 , this.textureCoordinates.w
																				 , this.textureCoordinates.h
																				 , x
																				 , y
																				 , this.textureCoordinates.w
																				 , this.textureCoordinates.h
																				 )
			this.book.graphic.contextUI.drawImage( this.book.uiSprite.canvas
																				 , this.textureCoordinates.x
																				 , this.textureCoordinates.y
																				 , this.textureCoordinates.w
																				 , this.textureCoordinates.h
																				 , x
																				 , y
																				 , this.textureCoordinates.w
																				 , this.textureCoordinates.h
																				 )

		}



		codePage = Object.create( protoPage )  ;		
		codePage.name = "code" ;
		codePage.textureName = "notebookpage" ;
		codePage.intercalaire = true
		codePage.init = function( book, index ) {
			protoPage.init.call( this, book, index ) ; 
			var context = this.book.sprite ; 
			var uiContext = this.book.uiSprite ; 			

			context.save() ;
			uiContext.save() ; 
			//Position on the correct page		
			context.translate( this.textureCoordinates.x + 10,  this.textureCoordinates.y + 10 )
			uiContext.translate( this.textureCoordinates.x + 10,  this.textureCoordinates.y + 10 )
			context.rotate( this.angle )
			uiContext.rotate( this.angle )

			//Adding information to the color map
			uiContext.globalCompositeOperation = "lighter"

			var element = [] ;

			var i = 0
				, espacement = 2* (( 29 ) / 2 + 0.02)

			

			for( var letter in code ) {

				context.font = "16px Cutive Mono"

				element.push( [ letter, code[letter] ] )
				//Draw color for the element, use the green canal for indice, blue for code or clear
				uiContext.fillStyle= "rgb(0,"+ element.length *5 +",0)"				
				uiContext.fillRect( 136/2, espacement + espacement * i -13, context.measureText( letter + " : " ).width, 16 )
				uiContext.fillStyle= "rgb(0,"+ element.length *5+",128)"				
				uiContext.fillRect( 136/2 + 23 * 3 , espacement + espacement * i-13, context.measureText( code[ letter ] ).width, 16 );
				uiContext.fillStyle="black"

				//save the element to know how to respond on a click
				

				context.fillText(  letter + " : " , 136/2, espacement + espacement * i );
				context.fillText( code[ letter ], 136/2 + 23 * 3 , espacement + espacement * i );

				i++
				if( i > 18 ) {
					i = 0
					context.translate( 200, 0 )
					uiContext.translate( 200, 0 )
				} 
			}
			context.restore() ;
			uiContext.restore() ;
			this.element = element 
		}

		codePage.click = function( redChannel, greenChannel, blueChannel, event ) {
			indice = Math.round ( greenChannel / 5 ) -1 
			if( indice < 0 ) 	protoPage.click.call( this, redChannel, greenChannel, blueChannel, event ) ; 
			else console.log( "click on ", this.element[ indice ] [ Math.round ( blueChannel / 128 ) ]  )
		
		}







		//Position the book
		book.position = function (x, y ) {
					this.x = x
					this.y = y 
		}

		book.render =function(  ) {
			//Render back pages
			
			for (var i = 0 ; i < this.pageActive ; i++) {
				this.pages[i].render( this.x, this.y ) ;
			}
			//Render front pages
			for (var i = this.pages.length - 1; i >= this.pageActive; i--) {
				this.pages[i].render( this.x, this.y ) ;
			}
		}

		book.init = function( graphic, audio ) {
			this.graphic = graphic ;
			this.audio = audio ; 
			//init all pages 
			
			this.pages.push( protoPage )
			this.pages.push( Object.create( protoPage, Object.getOwnPropertyDescriptors(
				{ name : "Mission"
				, textureName : "notebookpage"
				, intercalaire : true }) ))
			this.pages.push( codePage )
			this.pages.push( Object.create( protoPage, Object.getOwnPropertyDescriptors(
				{ name : "Map"
				, textureName : "notebookmap"
				, intercalaire : true }) ))
			

			var texture = this.graphic.textures[ this.pages[0].textureName ]
				, height = this.size / texture.width * texture.height 
				, width = this.pages.length * ( this.size + 100 )


			this.sprite = this.graphic.getOffscreenBuffer( width , height ) 

			this.uiSprite = this.graphic.getOffscreenBuffer( width , height ) 
			
			for (var i = 0; i < this.pages.length; i++) {				
				this.pages[i].init( book , i )
			}

			
		}
		book.click = function( indexPage) {
			this.pageActive = indexPage ;
			for (var i = 0; i < this.pages.length; i++) {				
				this.pages[i].init( this , i )
			}

			this.graphic.refresh() ;
		}

		book.drag = function( indexPage, state, dx, dy ) {
		
			if( indexPage == 0 ) {
				if( state == "continue") {				
					this.x += dx 
					this.y += dy
					this.graphic.refresh() ;					
				}
				return true ;	
			}
			return false ;
		}

		return book ; 

	}



)