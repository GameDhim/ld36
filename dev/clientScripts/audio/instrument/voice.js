define( ['audio/instrument/formantFrequency',  "audio/sourceNode/noise", "utils", 'audio/sourceNode/pulseOscillator', 'audio/adsr', 'audio/bufferLoader'],
	function( frequency ) {
	console.log( "voice.js ", frequency)


	audioContext = new AudioContext() ;


	bf = audioContext.createBufferLoader([
		 { label : "radio", url:"sounds/ir/radio.wav"}
		,{ label : "church", url:"sounds/ir/church.wav"} ], function() { })
	bf.load() ;

	
    AudioContext.prototype.createVoice = function( scope, range ) {


		
		var node = audioContext.createPulseOscillator();

		node.tremollo = audioContext.createOscillator() ;
		node.tremolloGain = audioContext.createGain() ; 
		node.output = audioContext.createGain() ; 
		

    	node.letter = "a"
    	node._range = range || "soprano"
		node.biquadFilterF = [] 

		
	
		node.filterTremollo = []
		node.filterTremolloGain = []
		
		node.adsrNode = audioContext.createADSR() ; 
		

		for( i = 0 ; i < 5 ; i++ ) {
			node.biquadFilterF[i] 		= audioContext.createBiquadFilter();
			node.filterTremollo[i] = audioContext.createWhiteNoise() ; 
			node.filterTremolloGain[i] 	= audioContext.createGain() ;
			node.filterTremollo[i].connect( node.filterTremolloGain[i] ) ;
			node.filterTremolloGain[i].gain.value = 10  ;
			node.filterTremolloGain[i].connect( node.biquadFilterF[i].detune ) ; 
			node.biquadFilterF[i].type = "bandpass";
		}


		node.output.gain.value = 0.9; 

		node.tremollo.type = 'sine';
		node.tremollo.frequency.value = 0.2; // value in hertz
		node.tremollo.start();
		node.tremolloGain.gain.value = 10 ; 
		node.tremollo.connect( tremolloGain ) ;
		//tremolloGain.connect( tune.detune )


		node.frequency.value = 220; // value in hertz
		node.gain.value=0.5 ;
	
		var constante1 = audioContext.createOscillator()
		, oscillator = audioContext.createOscillator()
		, oscillatorGain  = audioContext.createGain() 
		, gain3 = audioContext.createGain() 

		oscillator.frequency.value = 6 
		oscillatorGain.gain.value = 0.1 
		var real = new Float32Array(2);
		var imag = new Float32Array(2);	
		real[0] = 0.9 ;
		imag[0] = 0 ;
		real[1] = 0 ;
		imag[1] = 0 ;

		var wave = audioContext.createPeriodicWave(real, imag);
		constante1.setPeriodicWave( wave )

		constante1.start() 
		oscillator.start()

		audioContext.attach( oscillator, oscillatorGain, node.gain )
		audioContext.attach( constante1, node.gain )


		node.setFormant = function( range, letter, time ) {
			this.letter = letter 
			this._range = range 
			time += Math.random()*0.2

			for( i = 0 ; i < 5 ; i++ ) {		
				this.biquadFilterF[i].frequency.setValueAtTime( frequency[ this._range ][ this.letter ].freq[i], time );
				this.biquadFilterF[i].Q.setValueAtTime( frequency[ this._range ][ this.letter ].freq[i] / frequency[ this._range ][ this.letter ].bw[i] , time );
				this.biquadFilterF[i].gain.setValueAtTime( frequency[ this._range ][ this.letter ].amp[i], time );
			}	
		}

		node.setFormant( node._range, "o", audioContext.currentTime )
		
		audioContext.attach( node , node.biquadFilterF, node.adsrNode, node.output ) ; 
		

		
		node.play = function( tune, time, length, letter  ) {

			if( typeof time == "string" && time[0] == "+" ) {
				time = audioContext.currentTime + 1*time.slice(1) ;
			} 
			if( time == undefined ) time = audioContext.currentTime ;

	    
			
			this.setFormant( this._range, letter, time)
			this.detune.setValueAtTime( tune * Math.random2(1,0.05) , time )
			this.adsrNode.play( time, length)

			return time + length 
		} 
			
		node.connect = function() {
			this.output.connect.apply(this.output, arguments);								
			return node 
		}

		node.start() ;
		return node ; 

	}


})