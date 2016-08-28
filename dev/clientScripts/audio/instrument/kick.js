define(
	[ "utils"], 
	function() {
		AudioContext.prototype.createKick = function( options ) {
			audioContext = this ; //Alias because I find it clearer to read 

			var node = {}
			node._name = "kick"
			node.context = this 
			node.output = audioContext.createGain() ; 
			node.output.gain.value = 0
			node.connect = function() {
				node.output.connect.apply(node.output, arguments);								
				return node 
			}

			node.oscillator = audioContext.createOscillator() ; 
			node.oscillator.frequency.value = 150 ; 
			node.oscillator.start() ; 

			audioContext.attach( node.oscillator, node.output ) ; 

			node.play = function( tune, time, hold, strength ) {
				
				hold = Math.random2( 0.5, 0.25 ) 
				strength = (strength == undefined ) ?  Math.random2(0.9, 0.1) : strength

				if( typeof time == "string" && time[0] == "+" ) {
					time = audioContext.currentTime + 1*time.slice(1) ;
				}
				node.output.gain.setValueAtTime(strength, time);
				node.output.gain.exponentialRampToValueAtTime(0.001, time + hold);
				node.output.gain.setValueAtTime(0, time + 0.5);
				
				node.oscillator.frequency.setValueAtTime(150, time);
				node.oscillator.frequency.exponentialRampToValueAtTime(0.001, time + hold);

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