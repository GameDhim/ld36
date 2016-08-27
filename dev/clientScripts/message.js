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

		function createMessage( clearText ) {

			var message = Object.create( originalMessage )
			message.clearText = clearText  ; 
		}

		return createMessage ;
})