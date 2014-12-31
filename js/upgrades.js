/*************************************************
* Lightbulb Clicker's upgrade script file
* Controls drawing/accessing upgrades
*************************************************/
(function (window) {
	"use strict";
	window.Game.Upgrade = function(options) {
		var Game = window.Game;
		if (!options.name) options.name = 'None';
		if (!options.id) options.id = Tools.toId(options.name);
		if (!options.description) options.description = '...';
		if (!options.cost) options.cost = 0;
		if (!options.vps) options.boost = [["all",0]];
		options.amount = 0;
		if (!options.displayAt) options.displayAt = ["volts",0];
		if (!options.onBuy) options.onBuy = function () {}
		options.displayed = false;
		options.button = undefined;
		options.buy = function() {
			if (this.cost > Game.volts || this.amount === 1) return;
			Game._remove(this.cost);
			
			this.amount = 1;
			Game._calcVPS();
			this.onBuy();
			this.update();
		}
		options.refresh = function () {
			var self = this;
			if (!this.displayed) this.button.classList.add('hidden');
			if (this.amount === 1) return;
			var canDisplay = false;
			if ((Game.buildings[this.displayAt[0]]
				&& Game.buildings[this.displayAt[0]].amount >= this.displayAt[1])
				|| (this.displayAt[0] === 'volts' && Game.volts >= this.displayAt[1])) {
				canDisplay = true;
			}
			if (canDisplay) {
				this.displayed = true;
				this.button.classList.remove('hidden');
				Tools.fadeInObj(this.button);
			}
		}
		options.draw = function () {
			var tempButton = document.createElement('div');
			tempButton.setAttribute('class', 'upgradeObj');
			tempButton.setAttribute('id', 'upgrade-' + options.id);
			
			tempButton.style.backgroundImage = ('url ("' + options.id + '")');
			
			this.button = tempButton;
			Game.upgradeStore.appendChild(this.button);
		}
		return options;
	};
})(window);