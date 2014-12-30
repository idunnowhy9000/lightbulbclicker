/*************************************************
* Lightbulb Clicker's calc script file
* Controls calculations
*************************************************/
(function (window) {
	"use strict";
	window.Game.calc = {
		calcCost: function (num) {
			return Math.round(num.cost * Math.pow(num.increase,num.amount))
		},
		calcBdVPS: function (bd) {
			var bdBoost = 0, timesboost = 1;
			for (var i in Game.upgrades) {
				var u = Game.upgrades[i];
				/*for (ups in u.boost) {
					if (u.boost[ups][0] === bd.id || u.boost[ups][0] === 'all') {
						var _b = u.boost[ups][1];
						if (!typeof _b === 'number') {
							if (_b.substring(0,1) === 'x') {
								timesboost += _b.substring(1,_b.length);
							}
						}
						else { bdBoost += _b; }
					}
				}*/
			}
			return (bd.vps + bdBoost) * timesboost;
		},
		calcVPS: function () {
			var total=0,
				boostAll = 1;

			// calculate
			for (var b in Game.buildings) { // buildings
				var a = Game.buildings[b];
				total += this.calcBdVPS(a) * a.amount;
			}
			total *= boostAll;
			
			return total;
		},
		calcPrestiege: function () {
			return 0; // todo : fill this in
		},
		calcClick: function () {
			
		},
		rand: function (min, max) {
			return Math.floor(Math.random() * (max - min)) + min;
		},
		subtractDays: function (date1, date2) {
			return new Date().parse(date1.valueOf() - date2.valueOf())/(24*60*60*1000);
		}
	}
})(window);