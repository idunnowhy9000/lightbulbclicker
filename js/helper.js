/*************************************************
* Lightbulb Clicker's helper script file
* Helps all the script
*************************************************/
(function (window) {
	"use strict";
	// load
	window.loadTools = function () {
		var Tools = {};
		Tools.beautify = function (num) { return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); }
		Tools.toId = function (text) { return text.toString().toLowerCase().replace(/[^a-z0-9]+/g, ''); }
		Tools.choose = function (arr) { return arr[Math.floor(Math.random() * arr.length)]; }
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
			}
		}
		Tools.removeElement = function (el) {
			el.parentNode.removeChild(el);
		}
		Tools.metricSuffix = function (n) {
			var ranges = [
				{ divider: 1e30 , suffix: 'multivolts' },
				{ divider: 1e27 , suffix: 'hellavolts' },
				{ divider: 1e24 , suffix: 'yottavolts' },
				{ divider: 1e21 , suffix: 'zettavolts' },
				{ divider: 1e18 , suffix: 'petavolts' },
				{ divider: 1e15 , suffix: 'exavolts' },
				{ divider: 1e12 , suffix: 'teravolts' },
				{ divider: 1e9 , suffix: 'gigavolts' },
				{ divider: 1e6 , suffix: 'megavolts' },
			];
			return (function () {
				if (n <= 1) return n + " volt";
				for (var i = 0; i < ranges.length; i++) {
					if (n >= ranges[i].divider) {
						if ((n / ranges[i].divider) % 1 !== 0) return (n / ranges[i].divider).toFixed(2).toString() + ' ' + ranges[i].suffix;
						return (n / ranges[i].divider).toString() + ' ' + ranges[i].suffix;
					}
				}
				return n.toString() + " volts";
			})();
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