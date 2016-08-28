define(
	["audio/adsr", "utils"]
	, function() {
		console.log("trumpet")
		AudioContext.prototype.createEnharmonique = function( options ) {
			console.log( "createEnharmonique" )
			var node = this.createOscillator() 
			node.output = this.createGain() ; 
			node.output.gain.value = 0.5 ;
			var base = 220 ; 
			
			if( options != undefined && options.hasOwnProperty( "harmonics" ) ) {
				node.harmonics  = options.harmonics 

			} else {			
			 	node.harmonics = new Array(9)			
				var gains = [1, 1.5, 0.6, 2.5, 1.5, 1.3,0.6, 1, 0.05, 0.05]
				//var gains = [1, 0, 0.5, 0, 0.25, 0,0.3, 0.0, 0.01, 0.01]
				//var gains = [1, 0,0,0,0,0,0,0,0,0,00,0]

				for( var i = 0 ; i < node.harmonics.length ; i++ ) {
					node.harmonics[i] = {}
					node.harmonics[i].oscillator = this.createOscillator() 
					node.harmonics[i].oscillator.frequency.value = base + base * 5/3*i  * Math.random2( 1, 0.01 ) 

					node.harmonics[i].oscillator.start() 



					node.harmonics[i].adsr = this.createADSR( { attack : 0.3 + ( (i > 0 ) ? 0.1 : 0 ) 
					, decay : 0.1 
					, sustain : 1 
					, release : ( i == 0 ) ? 0.400 : 0.200 
					}) 

					node.harmonics[i].gain = this.createGain()
					node.harmonics[i].gain.gain.value = gains[i] 
					

					audioContext.attach( node.harmonics[i].oscillator, node.harmonics[i].adsr, node.harmonics[i].gain, node.output )

				}				
			}

			node.play = function(tune, time, length) {
				//console.log( "trumpette", tune, time, length )
				if( typeof time == "string" && time[0] == "+" ) {
					time = audioContext.currentTime + 1*time.slice(1) ;
				} 
				
				for( var i = 0 ; i < this.harmonics.length ; i++ ) {
					this.harmonics[i].oscillator.detune.setValueAtTime( tune, time )
					this.harmonics[i].adsr.play( time, length );						
				}
		
				return time + length 						
			}
			node.stop = function() {
				for( var i = 0 ; i < harmonics.length ; i++ ) {
					harmonics[i].oscillator.stop() 
				}
				this.output.disconnect() 	
			}

			node.connect = function() {
				this.output.connect.apply(this.output, arguments);								
				return node 
			}

			return node 

		}

	}
) 