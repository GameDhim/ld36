define(
	['adsr']
	, function() {
		console.log("piano")
		AudioContext.prototype.createPiano = function( options ) {
			var node = this.createOscillator() 
			var output = this.createGain() ; 
			var base = 110 
			if( typeof options == "integer" ) {
				base = options 
			} else	{
				base = ( typeof options =="object" && options.hasOwnProperty( "frequency" ) ) ? options.frequency : 440 ;
			}
			var harmonics = new Array(9)

			
			var gains = [1, 0.3, 0.1, 0.07, 0.05, 0.03, 0.012, 0.013, 0.0135, 0.012]

			for( var i = 0 ; i < harmonics.length ; i++ ) {
				harmonics[i] = {}
				harmonics[i].oscillator = this.createOscillator() 
				harmonics[i].oscillator.frequency.value = base *  (i+1);
				harmonics[i].oscillator.start() 



				harmonics[i].adsr = this.createADSR(  
				{ attack : 0.07
				, decay : 0.3 - ( i / 10 ) * 0.1  	
				, sustain : 0.6	 - ( i > 0 ) ? 0.3 : 0  
				, release : ( i == 0 ) ? -0.300 : -0.600 
				}) 

				
				harmonics[i].gain = this.createGain()
				harmonics[i].gain.gain.value = gains[i]

				audioContext.attach( harmonics[i].oscillator, harmonics[i].adsr, harmonics[i].gain, output )
			}


			node.play = function(tune, time, length) {
				if( typeof time == "string" && time[0] == "+" ) {
					time = audioContext.currentTime + 1*time.slice(1) ;
				} 
				console.log( tune, time, length)
				for( var i = 0 ; i < harmonics.length ; i++ ) {
					harmonics[i].oscillator.detune.setValueAtTime( tune, time )
					harmonics[i].adsr.play( time, length );	
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

			Object.defineProperty( node.frequency, "value", {
				set : function( val ) {
					for( var i = 0 ; i < harmonics.length ; i++ ) {
						harmonics[i].oscillator.frequency.value = val * i + val 
					}
					console.log( "helle")
				}
				, get : function (){
					return harmonics[0].oscillator.frequency.value
				}

			})


			return node 

		}

	}
) 