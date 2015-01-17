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
		if (!options.displayAt) options.displayAt = [];
		if (!options.onBuy) options.onBuy = function (Game) {}
		options.displayed = false;
		
		options.button = undefined;
		
		options.tooltip = undefined;
		
		options.buy = function() {
			if (this.cost > Game.volts || this.amount === 1) return;
			Game._remove(this.cost);
			
			this.amount = 1;
			Game._calcVPS();
			this.onBuy(Game);
			this.update();
		}
		options.refresh = function () {
			var self = this;
			if (Game.prefs.paused) return;
			
			if (!this.displayed) this.button.classList.add('hidden');
			if (this.amount === 1) return;
			var canDisplay = false;
			if ((Game.buildings[this.displayAt[0]] && Game.buildings[this.displayAt[0]].amount >= this.displayAt[1])
				|| (this.displayAt[0] === 'volts' && Game.volts >= this.displayAt[1])) {
				canDisplay = true;
			}
			if (canDisplay) {
				this.displayed = true;
				this.button.classList.remove('hidden');
				Tools.animateCSS(this.button, 'fadeIn');
			}
		}
		options.draw = function () {
			var tempBtn = document.createElement('div');
			tempBtn.setAttribute('class', 'upgradeObj');
			tempBtn.setAttribute('id', 'upgrade-' + options.id);
			
			tempBtn.style.backgroundImage = ('url ("' + options.id + '")');
			
			var tooltipContent = document.createElement('div');
			
			var tooltipDesc = document.createElement('span');
			tooltipDesc.textContent = this.description;
			tooltipContent.appendChild(tooltipDesc);
			
			tooltipContent.appendChild(document.createElement('br'));
			
			tooltipContent.appendChild(document.createTextNode('Costs '));
			
			var tooltipCost = document.createElement('span');
			tooltipCost.textContent = this.cost;
			tooltipContent.appendChild(tooltipCost);
			
			tooltipContent.appendChild(document.createTextNode(' volts'));
			
			var tooltip = new window.Tooltip({
				target: tempBtn,
				content: tooltipContent
			});
			
			this.button = tempBtn;
			this.tooltip = tooltip;
			
			Game.upgradeStore.appendChild(this.button);
		}
		return options;
	};
})(window);