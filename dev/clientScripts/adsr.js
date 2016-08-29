define( 
	function( ) {
		console.log( "adsr")


		AudioContext.prototype.createADSR = function( options ) {
			audioContext = this ; 
			

			gain = audioContext.createGain() ; 
			gain.attack  = (options && options.hasOwnProperty( "attack"  ) ) ? options.attack  : 0.100 ;
			gain.decay   = (options && options.hasOwnProperty( "decay"   ) ) ? options.decay   : 0.50  ; 
			gain.sustain = (options && options.hasOwnProperty( "sustain" ) ) ? options.sustain : 0.5 ;
			gain.release = (options && options.hasOwnProperty( "release" ) ) ? options.release : 0.30  ;
			gain.gain.value = 0 ; 

			gain.play = function ( time, hold ) {

				if( typeof time == "string" && time[0] == "+" ) {
					time = audioContext.currentTime + 1*time.slice(1) ;
				} 
				if( time == undefined ) time = audioContext.currentTime ;
				if( hold == undefined || hold < this.attack + this.decay  ) hold = this.attack + this.decay ; 

				
				var attack = time + this.attack  
				var decay = attack + this.decay 
				var release = 0 


				if( this.release > 0 ) {
					hold = time + hold 
					release = hold + this.release 
				} else {
					
					hold = time + hold + this.release 
					if( hold < decay ) hold = decay  
					release = hold - this.release 
				}
				// console.log( "adsr",  Math.round( 100 * time) 
				// 				   ,  Math.round( 100 * (attack -time))
				// 				   ,  Math.round( 100 * (decay-time))
				// 				   ,  Math.round( 100 * (hold-time))								   
				// 				   ,  Math.round( 100 * (release-time)) )
			
				


				//cancel all other change
				this.gain.cancelScheduledValues( time ) ;
				this.gain.setValueAtTime( 0 , time ) ;
				//attack
				this.gain.linearRampToValueAtTime( 1, attack ) ;
				//decay
				this.gain.linearRampToValueAtTime( this.sustain, decay) ;
				//hold
				this.gain.setValueAtTime( this.sustain, hold) ;
				//release
				this.gain.linearRampToValueAtTime( 0 , release ) ;
//				console.log( Math.round( 1000 * (time - Math.floor( time )) ) , Math.round( 1000 * (this.attack) ), Math.round( 1000 * (decay - time) ), Math.round( 1000 * (hold - time) ), Math.round( 1000 * (release - time) )               )

				return { start : time, hold : hold, end : release }  
			}

			return gain ; 

		}

	}

)