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


		}

		MESSAGE.prototype.createSprite = function( ) {
			



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
		messageFactory.init = function ( audio, graphic ) {
			
			originalMessage.graphic = graphic 
			originalMessage.audio = audio 

		}
		return messageFactory ;
})