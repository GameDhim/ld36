define(
	[ "utils", "audio/sourceNode/noise", "audio/sourceNode/pulseOscillator"], 
	function() {
		AudioContext.prototype.createCymbal = function( options ) {
			audioContext = this ; //Alias because I find it clearer to read 

			var node = {}
			node._name = "cymbals"
			node.context = this 
			node.output = audioContext.createGain() ; 
			node.output.gain.value = 0
			node.connect = function() {
				node.output.connect.apply(node.output, arguments);								
				return node 
			}
			node.oscillators = new Array(6)
			node.oscillatorsEnvelope = []
			node.tremolloGains = [] 
			node.tremollos = [] 

			mix = audioContext.createGain() ;
			node.noise = audioContext.createPinkNoise() ; 

			gain = audioContext.createGain() ;
			gain.value = 1
			pascal = [1,5,10,10,5,1]
			for( var i = 0 ; i < node.oscillators.length ; i ++ ) {
				oscillator = audioContext.createPulseOscillator()
				oscillator.frequency.value = 490 + i  
				oscillator.gain.value = 0.1 + Math.random() / 3 
				oscillator.start() ;			
	
				oscillatorEnvelope = audioContext.createGain() 
				oscillatorEnvelope.gain.value = 0.02 * pascal[ i ]
	
				tremollo = audioContext.createPulseOscillator()
				tremollo.frequency.value = 1047 + i * 10 
				tremollo.start() ; 
				tremollo.gain.value = 0.5 
				tremolloGain = audioContext.createGain() 
				tremolloGain.gain.value = 200 ;
	
				audioContext.attach( tremollo, tremolloGain, oscillator.detune )	
				audioContext.attach( tremollo, oscillatorEnvelope.gain ) ;
				audioContext.attach( oscillator, oscillatorEnvelope,  mix ) ; 

				node.oscillators[i] = oscillator 
				node.oscillatorsEnvelope[i] = oscillatorEnvelope ;
				node.tremolloGains[i] = tremolloGain
				node.tremollos[i] = tremollo
			}
			
			


			node.attack = this.createBiquadFilter() ; 
			node.attack.type = "bandpass";
			node.attack.frequency.value = 1000 
			node.attack.Q.value = 10 
			//attack.gain.value = -25 

			node.body = this.createBiquadFilter() ; 
			node.body.type = "highpass";
			node.body.frequency.value = 3640 
			


			for( var j = 1 ; j < 5 ; j++ ) {
				tone = this.createBiquadFilter() ; 
				tone.type = "bandpass";
				tone.frequency.value = 800 * i
				tone.Q.value = 6
				tone.gain.value = 40 / i 
				audioContext.attach( mix, tone, gain )
			}
		

			node.attackEnvelope = audioContext.createGain()
			node.bodyEnvelope = audioContext.createGain()

			node.shuintement = audioContext.createGain() 
			node.shuintement.gain.value = 1 

			mix.connect( node.shuintement )
			
			audioContext.attach( mix ,  node.attack, node.attackEnvelope, node.output )
			audioContext.attach( [gain,  node.shuintement ] , node.body, node.bodyEnvelope, node.output )

			
			node.play = function( tune, time, hold, strength ) {
				if( typeof time == "string" && time[0] == "+" ) {
					time = audioContext.currentTime + 1*time.slice(1) ;
				}

				base =  Math.random2(800, 20 )
				hold = Math.random2( 0.75, 0.25 )
				strength = (strength == undefined ) ?  Math.random2(0.7, 0.2) : strength
				this.attack.Q.value = 7 + Math.random() * 5 //Change how hard the cymbal is struck (low == harder )
				for( var i = 0 ; i < node.oscillators.length ; i ++ ) {
					this.oscillators[i].frequency.setValueAtTime( base + i * 40  , time )
					// this.oscillators[i].frequency.exponentialRampToValueAtTime( base , time + 0.5  )

					// this.tremolloGains[i].gain.setValueAtTime(200, time )
					// this.tremolloGains[i].gain.exponentialRampToValueAtTime(1, time + 0.1 )

					// this.tremollos[i].frequency.setValueAtTime(1047 + i * 10 , time )
					// this.tremollos[i].frequency.exponentialRampToValueAtTime(1047 , time + 2 )
				}
			
				this.attackEnvelope.gain.cancelScheduledValues( time ) ; 
				this.attack.frequency.cancelScheduledValues( time ) ; 
				this.bodyEnvelope.gain.cancelScheduledValues( time ) ; 
				this.body.frequency.cancelScheduledValues( time ) ; 


				this.attackEnvelope.gain.setValueAtTime(0, time);
				this.attackEnvelope.gain.exponentialRampToValueAtTime(0.5*strength, time + 0.005);
				this.attackEnvelope.gain.exponentialRampToValueAtTime(0.01, time + 0.1 + Math.random()/10  );
				this.attackEnvelope.gain.setValueAtTime( 0, time + 0.2 )

				this.attack.frequency.setValueAtTime(1000, time);
				this.attack.frequency.exponentialRampToValueAtTime(2000, time + 0.005);
				this.attack.frequency.exponentialRampToValueAtTime( 1000, time + 0.1 + Math.random()/10  );

				this.shuintement.gain.setValueAtTime(0, time);
				this.shuintement.gain.linearRampToValueAtTime(0.7*strength, time  + 0.1);
				this.shuintement.gain.exponentialRampToValueAtTime(0.01, time + 0.4);
				this.shuintement.gain.setValueAtTime(0, time + 2);

			


				this.bodyEnvelope.gain.setValueAtTime(0, time);
				this.bodyEnvelope.gain.linearRampToValueAtTime(0.5*strength, time  + 0.1);
				this.bodyEnvelope.gain.exponentialRampToValueAtTime(0.01, time + 2);
				this.bodyEnvelope.gain.setValueAtTime(0, time + 2);
			
				this.body.frequency.setValueAtTime(2600, time);
				this.body.frequency.exponentialRampToValueAtTime(5000, time + 0.1);
				this.body.frequency.exponentialRampToValueAtTime( 1600, time  + 2 );

				this.output.gain.setValueAtTime( 0, time )	
				this.output.gain.linearRampToValueAtTime( .5*strength, time +0.01 )	
				this.output.gain.exponentialRampToValueAtTime(0.03, time + Math.min( 0.5, hold ) ) ;
				this.output.gain.linearRampToValueAtTime( 0, time + hold + 0.1 )

				return time + hold 
			}
			node.connect = function() {
				node.output.connect.apply(node.output, arguments);								
				return node 
			}
			node.stop = function() {
				for( var i = 0 ; i < this.oscillators.length ; i ++ ) {
					this.oscillators[i].stop() 
					this.tremollos[i].stop() 
				}
				node.output.disconnect() ;
			}
			return node 
		}



	} 
)