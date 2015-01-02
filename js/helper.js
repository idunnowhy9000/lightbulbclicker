/*************************************************
* Lightbulb Clicker's helper script file
* Helps all the script
*************************************************/
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
			}
			// i would've had an activex fallback here
			// but i don't... yet(?)
			// jokes aside, it's because i or we don't support ie6 anymore
			// i mean srsly it's 2015 people
		}
		Tools.isEventSupported = function (eventName) {
			var TAGNAMES = {
				'select':'input','change':'input',
				'submit':'form','reset':'form',
				'error':'img','load':'img','abort':'img'
			}
			return (function (eventName) {
				var el = document.createElement(TAGNAMES[eventName] || 'div');
				eventName = 'on' + eventName;
				var isSupported = (eventName in el);
				if (!isSupported) {
					el.setAttribute(eventName, 'return;');
					isSupported = typeof el[eventName] == 'function';
				}
				el = null;
				return isSupported;
			})(eventName);
		}
		Tools.removeElement = function (el) {
			el.parentNode.removeChild(el);
		}
		Tools.fadeInObj = function (el) {
			var fadeInClass = 'fading', fadeOutClass = 'unfade', hiddenClass = 'hidden';
			el.classList.remove(hiddenClass);
			el.classList.remove(fadeOutClass);
			el.classList.add(fadeInClass);
			function r() {
				el.classList.remove(fadeInClass);
				el.classList.remove(hiddenClass);
			}
			el.addEventListener("animationend", r, false);
			el.addEventListener("webkitAnimationEnd", r, false);
		}
		Tools.fadeOutObj = function (el) {
			var fadeInClass = 'fading', fadeOutClass = 'unfade', hiddenClass = 'hidden';
			el.classList.remove(fadeInClass);
			el.classList.remove(hiddenClass);
			el.classList.add(fadeOutClass);
			function r() {
				el.classList.remove(fadeOutClass);
				el.classList.add(hiddenClass);
			}
			el.addEventListener("animationend", r, false);
			el.addEventListener("webkitAnimationEnd", r, false);
		}
		Tools.tooltipify = function (el, elHover) {
			var prevX = false, prevY = false;
			return (function (el, elHover) {
				elHover.addEventListener('mouseover', function () {
					if (prevX === false || prevY === false) {
						el.style.left = Game.mouseX + "px";
						el.style.top = Game.mouseY + "px";
						
						prevX = Game.mouseX;
						prevY = Game.mouseY;
					}
					
					el.classList.remove('hidden');
					Tools.fadeInObj(el);
				});
				elHover.addEventListener('mouseleave', function () {
					if (prevX !== false || prevY !== false) {
						prevX = false;
						prevY = false;
					}
					Tools.fadeOutObj(el);
				});
			})(el, elHover);
		}
		Tools.slideInObj = function (el) {
			var slidingClass = 'sliding', unslidingClass = 'unslide', hiddenClass = 'hidden';
			el.classList.remove(hiddenClass);
			el.classList.add(slidingClass);
			el.classList.remove(unslidingClass);
			function r() {
				el.classList.remove(unslidingClass);
				el.classList.remove(hiddenClass);
			}
			el.addEventListener("animationend", r, false);
			el.addEventListener("webkitAnimationEnd", r, false);
		}
		Tools.slideOutObj = function (el) {
			var slidingClass = 'sliding', unslidingClass = 'unslide', hiddenClass = 'hidden';
			el.classList.remove(hiddenClass);
			el.classList.remove(slidingClass);
			el.classList.add(unslidingClass);
			function r() {
				el.classList.remove(unslidingClass);
				el.classList.add(hiddenClass);
			}
			el.addEventListener("animationend", r, false);
			el.addEventListener("webkitAnimationEnd", r, false);
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
				{ divider: 1e3 , suffix: 'kilovolts' },
				{ divider: 1e2 , suffix: 'hectovolts' },
				{ divider: 1e1 , suffix: 'decavolts' },
				{ divider: 1 , suffix: 'volts' },
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