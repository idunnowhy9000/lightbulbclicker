(function (window) {
	"use strict";
	// load
	window.loadTools = function () {
		var Tools = {};
		Tools.beautify = function (num) {
			return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		}
		Tools.toId = function (text) {
			return text.toString().toLowerCase().replace(/[^a-z0-9]+/g, '');
		}
		Tools.choose = function (arr) {
			return arr[Math.floor(Math.random() * arr.length)];
		}
		Tools.l = function (thing) { return document.querySelector(thing); }
		Tools.log = function (thing) { return console.log(thing); } // for debugging purposes
		Tools.ajax = function ajax(url, callback) {
			var httpRequest;
			if (window.XMLHttpRequest) {
				httpRequest = new XMLHttpRequest();
				if (callback) {
					httpRequest.onreadystatechange = function () {
						if(httpRequest.readyState === 4) {
							callback(httpRequest.responseText);
						}
					};
				}
				httpRequest.open('GET', url);
				httpRequest.send();
			} else {
				// i would've had an activex fallback here
				// but i don't... yet(?)
				// jokes aside, it's because i or we don't support ie6 anymore
			}
		}
		
		window.Tools = Tools;
		window.l = Tools.l;
		window.log = Tools.log;
		window.ajax = Tools.ajax;
		
		// polyfills
		// requestAnimationFrame polyfill by paul irish
		window.requestAnimFrame = (function(){
			return window.requestAnimationFrame ||
				window.webkitRequestAnimationFrame ||
				window.mozRequestAnimationFrame ||
				function( callback ){
					window.setTimeout(callback, 1000 / 60);
				};
		})();
	};
})(window);