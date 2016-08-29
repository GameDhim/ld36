define( 
	[ "audio/instrument/piano", "audio/instrument/clarinette", "audio/instrument/kick" , "audio/instrument/snare", "audio/instrument/enharmonique", "audio/instrument/cymbal", "audio/instrument/voice", "audio/instrument/trumpet"],
	function() {
		console.log("Intruments");

		AudioContext.prototype.createInstrument = function( instrumentFactory, poolSize ) {
			instrumentPool = this.createGain() ; 

			instrumentPool.generators = new Array(6)
			instrumentPool.freeTime = []
			
			
			instrumentPool.init = function( factory, poolSize ) {
				if( poolSize == undefined ) {
					poolSize = this.generator.length
				}
				this.generators = new Array( poolSize ) ; 

				for( var i = 0 ; i < this.generators.length ; i++ ) {
					this.generators[i] = factory.call( this.context, this.generators[0] ) ; 
					this.generators[i].connect( this )
			
					this.freeTime[i] =instrumentPool.generators[i].context.currentTime  ; 
				}
			}

			instrumentPool.play = function( ) {
				var min = 0 
				//console.log( this.generators[0], this.generators.length, arguments[1] )
				for( var i = 0 ; i < this.generators.length ; i++ ) {
					
					if( this.freeTime[i] < arguments[1] ) {
						this.freeTime[i] = this.generators[i].play.apply( this.generators[i], arguments ) ;
						console.log( "instrument " + i )
						return this.freeTime[i]
					} 
					if( this.freeTime[i] < this.freeTime[min] ) min = i 
				}
				//take the generator that finish the soonest
				console.log( "not enough instrument " + min )
				this.freeTime[min] = this.generators[min].play.apply( this.generators[min], arguments ) ;
			}

			instrumentPool.stop = function() {
				for( var i = 0 ; i < this.generators.length ; i++ ) {
					this.generators[i].stop()
				}

			}
			if( instrumentFactory != undefined ) instrumentPool.init( instrumentFactory, poolSize ) ; 
			return instrumentPool ;
		}
	}

)