define( ["messageFactory"],
	function( messageFactory ) {

		var telegraph = {}


		//Initialize the telegraph 
		telegraph.init = function( graphic, audio ) {
			this.graphic = graphic ; 
			this.audio = audio ; 

			var m = messageFactory.createMessage( "coucou")
			this.play( m )
		}


		//take a message a play the di da di daa corresponding
		telegraph.play = function ( message ) {
			console.log( message )

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


