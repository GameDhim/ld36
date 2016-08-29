/*
Copyright to someone... probably took that and modified it from Boris Smusà
I copy paste this part from project to project...
*/
define(

	function(  ){

		function BufferLoader(context, urlList, callback) {
			this.context = context;
			this.urlList = urlList;
			this.onload = callback;
			this.bufferList = {} ;
			this.loadCount = 0;
		}

		BufferLoader.prototype.loadBuffer = function(url, index) {
			// Load buffer asynchronously
			var request = new XMLHttpRequest();
			request.open("GET", url, true);
			request.responseType = "arraybuffer";

			var loader = this;

			request.onload = function() {
				// Asynchronously decode the audio file data in request.response
				loader.context.decodeAudioData(
					  request.response
					, function(buffer) {
						if (!buffer) {
							console.warn('error decoding file data: ' + url);
							return;
						}
						loader.bufferList[index] = buffer;
						if (++loader.loadCount == loader.urlList.length)
							loader.onload(loader.bufferList);
					}
					, function(error) { console.error('decodeAudioData error', error); }
				);
			}

			request.onerror = function() {
				console.warn('BufferLoader: XHR error');
			}

			request.send();
		}

		BufferLoader.prototype.load = function() {
			for (var i = 0; i < this.urlList.length; ++i)
				this.loadBuffer(this.urlList[i].url || this.urlList[i], this.urlList[i].label || i );
		}



		AudioContext.prototype.createBufferLoader = function( urlList, callback ) {
			return new BufferLoader( this, urlList, callback ) ; 
		} 
		

	}




)