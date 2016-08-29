define( 
	["audio/bufferLoader", "audio/instrument", "audio/music"],
	function() {
		var audio = new AudioContext() ; 

		AudioContext.prototype.createAudioBus = function( callback ) {
			audioContext = this ; //aliasing for clarity	

			var node = audioContext.createGain() ; 

			//Create a channel for wet and dry stuff
			node.wet = audioContext.createConvolver() 
			node.dry = audioContext.createGain() ; 
			node.compressor  = audioContext.createDynamicsCompressor();

			//Compressor Values
			node.compressor.threshold.value = -50;
			node.compressor.knee.value = 40;
			node.compressor.ratio.value = 12;
			node.compressor.reduction.value = -20;
			node.compressor.attack.value = 0;
			node.compressor.release.value = 0.25;

			node.gain.value = 0.6 
			node.dry.gain.value = 0.1


			bf = audioContext.createBufferLoader(
				[ { label : "radio", url:"sounds/ir/radio.wav"}
				, { label : "church", url:"sounds/ir/church.wav"}
				, { label : "phone", url:"sounds/ir/telephone.wav"} 
				]
				, callback )
			
		

			node.changeImpulseResponse = function( impulseResponse ) {
				if( typeof impulseResponse == "string" &&  bf.bufferList.hasOwnProperty( impulseResponse )) {
					this.wet.buffer = bf.bufferList[ impulseResponse ]
				} else if( impulseResponse instanceof AudioBuffer) {
					this.wet.buffer = impulseResponse ;
				}
			}

			bf.load() ;
		
			audioContext.attach( node, [node.wet, node.dry], node.compressor, audioContext.destination ) ; 

			return node ;
		}


		bufferLoaded = function( ) {
				this.bus.changeImpulseResponse( "radio" ) ;
				this.onInit( "audio", this ) ;
		}
		//initialize audio stuff
		audio.init = function( ) {
			audio.bus = audio.createAudioBus( bufferLoaded.bind( this ))

			audio.clarinette = audio.createInstrument( audio.createClarinette, 6 )
			audio.clarinette.connect( audio.bus )
			notes = [ -200, 0, 200, 500, 700, 1000 ]

			baseTime = audio.currentTime 
			// audio.clarinette.play( notes[0], baseTime+1, 0.200, "a" )
			// audio.clarinette.play( notes[1], baseTime+2, 0.200, "a" )
			// audio.clarinette.play( notes[3], baseTime+3, 0.200, "a" )
			// audio.clarinette.play( notes[0], baseTime+4, 0.200, "a" )

			audio.biper = audio.createOscillator() ;
			audio.biper.start() ;
			audio.gainBip = audio.createGain() ; 

			audio.biper.connect( audio.gainBip ) ;
			audio.gainBip.gain.value = 0 ; 
			audio.gainBip.connect( audio.bus )			

			music.init( audio, audio.bus )

			music.scheduleNextMesure(0, audio.currentTime + 0.2) 
		}


		audio.startBip= function( ) {
			
			audio.gainBip.gain.value = 1 
			audio.gainBip.startTime = audio.currentTime 
			
			audio.gainBip.gain.setValueAtTime( 0, audio.currentTime + 0.001)
			audio.gainBip.gain.linearRampToValueAtTime( 0.3, audio.currentTime + 0.01)
		}	
		audio.stopBip = function() {
			
			if( audio.currentTime - audio.gainBip.startTime  < 0.1 ) {
				audio.gainBip.gain.linearRampToValueAtTime( 0.1, audio.gainBip.startTime+ 0.08 )
				audio.gainBip.gain.linearRampToValueAtTime( 0, audio.gainBip.startTime+ 0.1 )
				audio.gainBip.gain.setValueAtTime( 0.3, audio.currentTime +0.1-0.01 )
				audio.gainBip.gain.linearRampToValueAtTime( 0, audio.currentTime +0.1)
			}
			else {
				audio.gainBip.gain.setValueAtTime( 0.3, audio.currentTime )
				audio.gainBip.gain.linearRampToValueAtTime( 0, audio.currentTime +0.01 )
			}
		}


		audio.play = function( t, l ) {
			audio.gainBip.gain.setValueAtTime( 0, t + 0.001)
			audio.gainBip.gain.linearRampToValueAtTime( 0.3, t + 0.01)
			audio.gainBip.gain.setValueAtTime( 0.3, t+l-0.01 )
			audio.gainBip.gain.linearRampToValueAtTime( 0, t + l)
		}


		return audio ; 
})