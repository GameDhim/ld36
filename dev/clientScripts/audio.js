define( 
	["audio/bufferLoader", "audio/instrument"],
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

			node.gain.value = 0.4 
			node.dry.gain.value = 0.5

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
		}


		return audio ; 
})