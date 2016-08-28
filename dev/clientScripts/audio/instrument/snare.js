define(
	[ "utils", "audio/sourceNode/noise"], 
	function() {
		AudioContext.prototype.createSnare = function( options ) {
			audioContext = this ; //Alias because I find it clearer to read 

			var node = {}
			node._name = "snare"
			node.context = this 
			node.output = audioContext.createGain() ; 
			node.output.gain.value = 0
			node.connect = function() {
				node.output.connect.apply(node.output, arguments);								
				return node 
			}

			node.oscillator = audioContext.createOscillator() ; 
			node.oscillator.frequency.value = 150 ; 
			node.oscillator.type = 'square';
			node.oscillator.start() ; 

			node.oscillatorEnvelope = audioContext.createGain() 

			node.noise = audioContext.createWhiteNoise() ; 
			node.noiseFilter = audioContext.createBiquadFilter();
			node.noiseFilter.type = 'highpass';
			node.noiseFilter.frequency.value = 1000;

			node.noiseEnvelope = audioContext.createGain() 

			audioContext.attach( node.noise, node.noiseFilter, node.noiseEnvelope,  node.output ) ; 
			audioContext.attach( node.oscillator, node.oscillatorEnvelope,  node.output ) ; 

			node.play = function( tune, time, hold, strength ) {
				if( typeof time == "string" && time[0] == "+" ) {
					time = audioContext.currentTime + 1*time.slice(1) ;
				}

				hold = Math.random2( 0.2, 0.05 )
				strength = (strength == undefined ) ?  Math.random2(0.8, 0.2) : strength
				

				this.output.gain.setValueAtTime( 1, time )			

				this.noiseEnvelope.gain.setValueAtTime(strength, time);
				this.noiseEnvelope.gain.exponentialRampToValueAtTime(0.01, time + hold);				

				this.oscillator.frequency.setValueAtTime(100, time);
				this.oscillatorEnvelope.gain.setValueAtTime(strength-0.3, time);
				this.oscillatorEnvelope.gain.exponentialRampToValueAtTime(0.01, time + hold/2);


				this.output.gain.setValueAtTime( 0, time + hold )

				return time + hold 
			}
			node.connect = function() {
				node.output.connect.apply(node.output, arguments);								
				return node 
			}
			node.stop = function() {
				node.oscillator.stop() ; 
				node.output.disconnect() 	
			}
			return node 
		}



	} 
)