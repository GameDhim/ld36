define(
	["audio/adsr", "utils"]
	, function() {
		console.log("clarinette")
		AudioContext.prototype.createClarinette = function( options ) {
			var node = this.createOscillator() 
			var output = this.createGain() ; 
			var base = 220 ; 
			
			if( options != undefined && options.hasOwnProperty( "harmonics" ) ) {
				node.harmonics  = options.harmonics 

			} else {
			 	harmonics = new Array(9)			
				var gains = [1, 0.05, 0.4, 0.12, 0.5, 0.05, 0.12, 0.12, 0.05, 0.05]
				//var gains = [1, 0,0,0,0,0,0,0,0,0,00,0]

				for( var i = 0 ; i < harmonics.length ; i++ ) {
					harmonics[i] = {}
					harmonics[i].oscillator = this.createOscillator() 
					harmonics[i].oscillator.frequency.value = base * (i+1)  * Math.random2( 1, 0.01 ) 
					harmonics[i].oscillator.start() 



					harmonics[i].adsr = this.createADSR( { attack : 0.1 + ( (i > 0 ) ? 0.1 : 0 ) 
					, decay : 0.1 
					, sustain : 1 
					, release : ( i == 0 ) ? 0.200 : 0.100 
					}) 

					harmonics[i].gain = this.createGain()
					harmonics[i].gain.gain.value = gains[i] 


					audioContext.attach( harmonics[i].oscillator, harmonics[i].adsr, harmonics[i].gain, output )

				}
				node.harmonics = harmonics
			}

			node.play = function(tune, time, length) {
				//console.log( "Clarinette", tune, time, length )
				if( typeof time == "string" && time[0] == "+" ) {
					time = audioContext.currentTime + 1*time.slice(1) ;
				} 
				
				for( var i = 0 ; i < harmonics.length ; i++ ) {
					this.harmonics[i].oscillator.detune.setValueAtTime( tune, time )
					this.harmonics[i].adsr.play( time, length );	
				}
		
				return time + length 						
			}
			node.stop = function() {
				for( var i = 0 ; i < harmonics.length ; i++ ) {
					harmonics[i].oscillator.stop() 
				}
				output.disconnect() 	
			}

			node.connect = function() {
				output.connect.apply(output, arguments);								
				return node 
			}

			return node 

		}

	}
) 