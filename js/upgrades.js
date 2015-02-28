/*************************************************
* Lightbulb Clicker's upgrade script file
* Controls drawing/accessing upgrades
*************************************************/
(function (Game) {
	"use strict";
	Game.Upgrade = function(options) {
		var Game = window.Game;
		if (!options.name) options.name = 'None';
		if (!options.id) options.id = Tools.toId(options.name);
		if (!options.description) options.description = '...';
		if (!options.cost) options.cost = 0;
		if (!options.vps) options.boost = [["all",0]];
		options.amount = 0;
		if (!options.displayAt) options.displayAt = [];
		if (!options.onBuy || !typeof options.onBuy !== 'function') options.onBuy = function (Game) {}
		options.displayed = false;
		
		options.button = undefined;
		
		options.tooltip = undefined;
		
		options.buy = function() {
			if (this.cost > Game.volts || this.amount === 1) return;
			Game._remove(this.cost);
			
			this.amount = 1;
			Game._calcVPS();
			Game._calcVPC();
			this.onBuy(Game);
			this.refresh();
		}
		options.refresh = function () {
			var self = this;
			if (Game.prefs.paused) return;
			
			if (!this.displayed || this.amount) this.button.classList.add('hidden');
			if (this.amount) return;
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
		options.draw = function (getDOM) {
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
			
			if (getDOM) {
				var newBtn = tempBtn.cloneNode(true),
					newTooltipContent = tooltipContent.cloneNode(true),
					newTooltip = new Tooltip({
						target: newBtn,
						content: newTooltipContent
					});
				return tempBtn;
			}
			
			var tooltip = new Tooltip({
				target: tempBtn,
				content: tooltipContent
			});
			
			// events
			tempBtn.addEventListener('click',function () {
				options.buy();
			});
			
			this.button = tempBtn;
			this.tooltip = tooltip;
			
			Game.upgradeStore.appendChild(this.button);
		}
		return options;
	};
})(window.Game || {});