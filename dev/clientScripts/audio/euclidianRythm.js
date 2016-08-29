define( 
[], function() {
	
			rythm = Object.create( [] )
			rythm.cycle = function( numberOfShifts ) {
				while (numberOfShifts-- > 0 )  this.push( this.shift() )
				return this 
			} 
			rythm.concat = function( array ) {
				while( array.length > 0 ) this.push( array.shift() ) 
				return this 
			}
			rythm.add = function( rythm2 ) {
				for( var i = 0 ; i < this.length ; i++ ) {
					this[i] = (this[i] == "." ) ? rythm2[i % rythm2.length ] : this[i] 
				}
				return this
			}

			function bjorklund( list1, list2 ) {
				if( list2.length == 0 ) return list1
				var new_list1 = Object.create( rythm )
				while( list1.length > 0 && list2.length > 0 ) {
					var a = list1.pop() 
					var b = list2.pop() 
					new_list1.push( a.concat( b ) ) 

				}
				return bjorklund( new_list1, (list1.length ) ? list1 : list2 ) ;
			}

			AudioContext.prototype.createEuclidianRythm = function( length, beat, beatValue ) {
				var list1 = Object.create( rythm )
				  , list2 = Object.create( rythm )
				if( beatValue == undefined ) beatValue = ["X","."]



				for( var i = 0 ; i < beat ; i++ ) list1.push( [beatValue[0]] ) ;
				for( var i = 0 ; i < length - beat ; i++ ) list2.push( [beatValue[1]] ) ;

				return bjorklund( list1, list2 ).reduce( function( prev, val ) { 
					return prev.concat( val ) 
				}, Object.create( rythm ) )
			}


		
	



})