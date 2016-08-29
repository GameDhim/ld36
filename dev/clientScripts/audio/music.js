define( [  "audio/bufferLoader", "audio/instrument", "audio/euclidianRythm" ],
function() {
	audioContext = null 
		notes = [ -200, 0, 200, 500, 700, 1000 ]
		n1 = 0 
		n2 = 1

		baseTime = 0 ; 


		//Double croche
		measureBeatCount = 4 
		mesurePulseCount = measureBeatCount * 4 
		beatPerMinute = 50 
		beatLength = 60 / beatPerMinute  ; //ms
		pulseLength = beatLength / 4 

	function createPanner( position ){
		panner = audioContext.createPanner() ; 
	  panner.setPosition(position[0], position[1], position[2] )
	  panner.setOrientation(-position[0], -position[1], -position[2] )

	  panner.panningModel = 'HRTF';
		panner.distanceModel = 'inverse';
		panner.refDistance = 1;
		panner.maxDistance = 10000;
		panner.rolloffFactor = 0.5;
		panner.coneInnerAngle = 120;
		panner.coneOuterAngle = 0;
		panner.coneOuterGain = 0;				

		return panner 
	}
	music = {}
	music.init = function( audio, audioBus ) {
		audioContext = audio
		baseTime = audio.currentTime
		masterGainNode = audioContext.createGain() 
  	masterGainNode.gain.value = 0.1  

  	clarinetteGain = audioContext.createGain() 
  	clarinetteGain.gain.value = 0.1  

  	positionC1 = createPanner( [14, 0, -15])
		positionC2 = createPanner( [-14, 0, -15])
		positionC3 = createPanner( [0, 0, -5])

    positionC1.connect( masterGainNode )
    positionC2.connect( masterGainNode )
    positionC3.connect( masterGainNode )

   	instruments = [] ; 

    cymbals = audioContext.createInstrument( audioContext.createCymbal, 6 )
    cymbals.connect( positionC3 );
    instruments.push( cymbals )

    kick = audioContext.createInstrument( audioContext.createKick, 3 )
    kick.connect( positionC3 );
		instruments.push( kick )

    snare = audioContext.createInstrument( audioContext.createSnare, 4 )
    snare.connect( positionC3 );
    instruments.push( cymbals )

    clarinette1 = audioContext.createInstrument( audioContext.createClarinette, 12 )
    clarinette1.connect( clarinetteGain );
    clarinetteGain.connect( positionC3)
    instruments.push( clarinette1 )
    
		clarinette2 = audioContext.createInstrument( audioContext.createClarinette, 12 )
    clarinette2.connect( clarinetteGain );
    
    instruments.push( clarinette2 )

    alfred = audioContext.createInstrument( audioContext.createVoice, 1 ) ; 
    alfred.connect( positionC1 )
    instruments.push( alfred )

    alfred2 = audioContext.createInstrument( audioContext.createVoice.bind( this, this, "soprano"), 1 ) ; 
    alfred.connect( positionC1 )
    instruments.push( alfred2 )
    alfred3 = audioContext.createInstrument( audioContext.createVoice.bind( this, this, "countertenor"), 1 ) ; 
    alfred.connect( positionC1 )
    instruments.push( alfred3 )

    bob = audioContext.createInstrument( audioContext.createVoice.bind( this, this, "alto"), 1 ) ; 
    bob.connect( positionC2 )
    instruments.push( bob )

    console.log( instruments )
   
    masterGainNode.connect( audioBus ) ; 
    this.instruments
	}




music.scheduleNextMesure = function( mesureCount, baseTime ) {
	if( baseTime < audioContext.currentTime + measureBeatCount * beatLength ) {
		//Next schedule would be to late
		
		this.play( mesureCount, baseTime ) ;
		mesureCount ++ 
		baseTime += measureBeatCount * beatLength
	
	} 
	if( mesureCount < 21000 ) {
		setTimeout( this.scheduleNextMesure.bind( this, mesureCount, baseTime  ), measureBeatCount * beatLength / 4 * 1000	 ) 
	} else {
		// setTimeout( function(instruments) { for( var i = 0 ; i < instruments.length ; i++ ) {instruments[i].stop( ) ; }
		// }.bind( this, instruments ) , baseTime + beatPerMesure * beat * 5) 
	}
}



//scheduleNextMesure(0, audioContext.currentTime + 0.2) 


music.changePatterns = function() {
	console.log( "changePattern")
	kickPattern   = audioContext.createEuclidianRythm( 16, 4 + Math.randomInt( 1, 8 ) ) ; 
	snarePattern  = audioContext.createEuclidianRythm( 16,  Math.randomInt( 4, 12 ) ) ; 
	snarePattern.push( snarePattern.shift() ) 
	snarePattern.push( snarePattern.shift() ) 
	cymbalPattern = audioContext.createEuclidianRythm( 16,  4 * Math.randomInt( 1, 3 )  ) ; 
	cymbalPattern.push( cymbalPattern.shift() )

	

	// voicePattern =  audioContext.createEuclidianRythm( 16,  Math.randomInt( 1, 8 ) , ["a", "."] ) ; 
	// voicePattern.cycle( )


	var 
	  s = audioContext.createEuclidianRythm(8, Math.randomInt(2,6), ["_","."] ).cycle( Math.randomInt(0, 8 ) ) 
	, a = audioContext.createEuclidianRythm(8, Math.randomInt(2,6), ["a","."] ).cycle( Math.randomInt(0, 8 ) )  
	, e = audioContext.createEuclidianRythm(8, Math.randomInt(2,6), ["e","."] ).cycle( Math.randomInt(0, 8 ) )  
	, i = audioContext.createEuclidianRythm(8, Math.randomInt(2,6), ["i","."] ).cycle( Math.randomInt(0, 8 ) )  
	, o = audioContext.createEuclidianRythm(8, Math.randomInt(2,6), ["o","."] ).cycle( Math.randomInt(0, 8 ) )  
	, u = audioContext.createEuclidianRythm(8, Math.randomInt(2,6), ["u","."] ).cycle( Math.randomInt(0, 8 ) )  
	

	r = s.add( a ).add( o ).add( u ).add( i )

	var 
	  s = audioContext.createEuclidianRythm(16, Math.randomInt(2,14), ["_","."] ).cycle( Math.randomInt(0, 16 ) ) 
	, a = audioContext.createEuclidianRythm(16, Math.randomInt(2,14), ["1","."] ).cycle( Math.randomInt(0, 16 ) )  
	, e = audioContext.createEuclidianRythm(16, Math.randomInt(2,14), ["2","."] ).cycle( Math.randomInt(0, 16 ) )  
	, i = audioContext.createEuclidianRythm(16, Math.randomInt(2,14), ["3","."] ).cycle( Math.randomInt(0, 16 ) )  
	, o = audioContext.createEuclidianRythm(16, Math.randomInt(2,14), ["4","."] ).cycle( Math.randomInt(0, 16 ) )
	, t = audioContext.createEuclidianRythm(16, Math.randomInt(2,14), ["5","."] ).cycle( Math.randomInt(0, 16 ) )  
	, u = audioContext.createEuclidianRythm(16, Math.randomInt(2,14), ["0","."] ).cycle( Math.randomInt(0, 16 ) ) 	

	clarinettePattern = s.add( a ).add( e ).add( i ).add( o ).add( t ).add( u )

	var 
	  s = audioContext.createEuclidianRythm(16, Math.randomInt(2,6), ["_","."] ).cycle( Math.randomInt(0, 16 ) ) 
	, a = audioContext.createEuclidianRythm(16, Math.randomInt(2,8), ["1","."] ).cycle( Math.randomInt(0, 16 ) )  
	, e = audioContext.createEuclidianRythm(16, Math.randomInt(2,14), ["2","."] ).cycle( Math.randomInt(0, 16 ) )  
	, i = audioContext.createEuclidianRythm(16, Math.randomInt(2,14), ["3","."] ).cycle( Math.randomInt(0, 16 ) )  
	, o = audioContext.createEuclidianRythm(16, Math.randomInt(2,14), ["4","."] ).cycle( Math.randomInt(0, 16 ) )
	, t = audioContext.createEuclidianRythm(16, Math.randomInt(2,14), ["5","."] ).cycle( Math.randomInt(0, 16 ) )  
	, u = audioContext.createEuclidianRythm(16, Math.randomInt(2,14), ["0","."] ).cycle( Math.randomInt(0, 16 ) ) 	

	clarinettePattern2 = s.add( a ).add( e ).add( i ).add( o ).add( t ).add( u )

	console.log( kickPattern, snarePattern, cymbalPattern, r, clarinettePattern, clarinettePattern2)
}
music.play =function ( mesureCount, baseTime ) {
	
	if( mesureCount % 4 == 0 ) {
		this.changePatterns() 
	}
    for( var i = 0 ; i < mesurePulseCount ; i++ ){
    	if( kickPattern[i] == "X" )   {
    		kick.play( 0, baseTime + i*pulseLength , 1 , (i % 4 ) ? 0.5 : 0.7 ) ;
    	}
    	if( snarePattern[i] == "X" )  snare.   play( 0, baseTime  + i*pulseLength , 1, (i % 4 ) ? 0.5 : 0.7  ) 
    	if( cymbalPattern[i] == "X" ) cymbals.   play( 0, baseTime  + i*pulseLength, 0.3 ) 


			n1 = ( 6 +  n1 + Math.randomInt( -2 , 2)  ) % 6 
    	n2 = ( 6 +  n2 + Math.randomInt( -2 , 2)  ) % 6 
    	if( Math.abs( notes[ n1 ] - notes[ n2 ] ) == 200 ) n2 = ( n2 + 1  ) % 6
        if( (i % 2 == 0) &&  "aeiou".indexOf( r[ i/2 ] ) > -1 ) {        	
        	alfred.play( notes[n1], baseTime+i*pulseLength, pulseLength, r[i/2] )
        	alfred2.play( notes[n1], baseTime+i*pulseLength, pulseLength*2, r[i/2] )
        }
        if( (i % 4 == 0) &&  "aeiou".indexOf( r[ i/2 ] ) > -1 ) {      
        	alfred3.play( notes[n1]+500, baseTime+i*pulseLength, pulseLength*4, r[i/2] )
        }
        if( ( Math.randomInt( 0, 1 ) % 2 == 0) &&  "aeiou".indexOf( r[ i/2 ] ) > -1 ) {        	
        	bob.play( notes[n2], baseTime+i*pulseLength, pulseLength, r[i/2] )
        }

      if( clarinettePattern[i] != "_" && clarinettePattern[i] != ".") {
      	for( j = i+1 ; j < mesurePulseCount && (clarinettePattern[j] == clarinettePattern[i]) ; j++ ) clarinettePattern[j] = "_" ;
				
      	clarinette1.play( notes[clarinettePattern[i]], baseTime+i*pulseLength, pulseLength * ( j - i ) )	
      }  
      if( clarinettePattern2[i] != "_" && clarinettePattern2[i] != ".") {
      	for( j = i+1 ; j < mesurePulseCount && (clarinettePattern2[j] == clarinettePattern2[i]) ; j++ ) clarinettePattern2[j] = "_" ;
				
      	clarinette1.play( notes[clarinettePattern2[i]], baseTime+i*pulseLength, pulseLength * ( j - i ) )	
      }  

    }

    

   

}

}

)