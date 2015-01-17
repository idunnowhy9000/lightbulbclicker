(function(window){
	'use strict';
	
	// requestAnimationFrame polyfill by paul irish
	window.requestAnimFrame = (function(){
		return window.requestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			function( callback ){
				window.setTimeout(callback, 1000 / 60);
			};
	})();
	
	// prefixed events
	var pfx = ["webkit", "moz", "MS", "o", ""];
	window.PrefixedEvent = function (element, type, callback) {
		for (var p = 0; p < pfx.length; p++) {
			if (!pfx[p]) type = type.toLowerCase();
			element.addEventListener(pfx[p]+type, callback, false);
		}
	}
})(window);