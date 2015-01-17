/*************************************************
* Lightbulb Clicker's building script file
* Controls drawing/accessing buildings
*************************************************/
(function (window) {
	"use strict";
	window.Game.Building = function(options) {
		if (!options.name) options.name = 'None';
		if (!options.commonName) options.commonName = '||';
		options.commonName = options.commonName.split('|');
		options.single = options.commonName[0] || options.name;
		options.plural = (options.commonName[1] === '0' ? (options.single + "s") : options.commonName[1]) || options.name + 's';
		options.actionName = options.commonName[2] || 'producing';
		if (!options.id) options.id = Tools.toId(options.name);
		if (!options.description) options.description = '';
		if (!options.cost) options.cost = 10;
		if (!options.vps) options.vps = 1;
		options.amount = 0;
		if (!options.increase) options.increase = 1.15;
		if (!options.displayAt) options.displayAt = 100;
		if (!!options.displayable) options.displayable = true;
		if (!options.onBuy || !typeof options.onBuy === 'options') options.onBuy = function () {}
		options.displayed = false;
		
		options.btnHolder = undefined;
		options.button = undefined;
		options.bdAmount = undefined;
		options.bdCost = undefined;
		
		options.tooltip = undefined;
		options.tooltipCost = undefined;
		options.tooltipAmount = undefined;
		options.tooltipVPS = undefined;
		options.tooltipProduceName = undefined;
		
		options.buySelectionNum = undefined;
		options.buySelectionAll = undefined;
		options.buy = function() {
			if (options.cost > Game.volts) { return false; }
			Game._remove(options.cost);
			
			options.amount++;
			options.cost = Game.calc.calcCost(options);
			Game._calcVPS();
			options.onBuy();
			options.refresh();
		}
		options.buyMultiple = function (value) {
			var v = Game.volts;
			while (v > options.cost) {
				v /= options.cost;
			}
			return v;
		}
		options.draw = function () {
			var btnHolder = document.createElement('div');
			btnHolder.setAttribute('class', 'btnHolder');
			btnHolder.setAttribute('id', 'holder-building-' + options.id);
			
			var tempBtn = document.createElement('div');
			tempBtn.setAttribute('class', 'bdObj btn');
			tempBtn.setAttribute('id', 'building-' + options.id);
			btnHolder.appendChild(tempBtn);
			
			var bdAmount = document.createElement('div');
			bdAmount.setAttribute('class', 'bdAmount');
			bdAmount.appendChild(document.createTextNode('0'));
			tempBtn.appendChild(bdAmount);
			
			var bdInfo = document.createElement('div');
			bdInfo.setAttribute('class', 'bdInfo');
			tempBtn.appendChild(bdInfo);
			
			var bdName = document.createElement('div');
			bdName.setAttribute('class', 'bdName');
			bdName.appendChild(document.createTextNode(options.name));
			bdInfo.appendChild(bdName);
			
			var bdCost = document.createElement('div');
			bdCost.setAttribute('class', 'bdCost');
			bdCost.appendChild(document.createTextNode('0'));
			bdInfo.appendChild(bdCost);
			
			tempBtn.addEventListener('click',function () {
				options.buy();
			});
			
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
			
			tooltipContent.appendChild(document.createElement('br'));
			
			var tooltipAmount = document.createElement('span');
			tooltipAmount.textContent = this.amount;
			tooltipContent.appendChild(tooltipAmount);
			
			var tooltipProduceName = document.createTextNode(" " + this.single);
			tooltipContent.appendChild(tooltipProduceName);
			
			tooltipContent.appendChild(document.createTextNode(" " + this.actionName));
			
			var tooltipVPS = document.createElement('span');
			tooltipVPS.textContent = this.vps;
			tooltipContent.appendChild(tooltipVPS);
			
			tooltipContent.appendChild(document.createTextNode(" volts per second."));
			
			var tooltip = new window.Tooltip({
				target: tempBtn,
				content: tooltipContent,
				position: 'right middle'
			});
			
			Game.store.appendChild(btnHolder);
			this.btnHolder = btnHolder;
			this.button = tempBtn;
			this.bdCost = bdCost;
			this.bdAmount = bdAmount;
			
			this.tooltip = tooltip;
			this.tooltipCost = tooltipCost;
			this.tooltipAmount = tooltipAmount;
			this.tooltipVPS = tooltipVPS;
			this.tooltipProduceName = tooltipProduceName;
		}
		options.refresh = function () {
			var self = this;
			if (Game.prefs.paused) return;
			
			if (!options.displayed) this.btnHolder.classList.add('hidden');
			if (Game.volts >= this.displayAt && !this.displayed) {
				this.displayed = true;
				this.btnHolder.classList.remove('hidden');
				Tools.animateCSS(this.btnHolder, 'fadeIn');
			}
			if (this.cost > Game.volts) {
				this.button.classList.add('disabled');
			} else {
				this.button.classList.remove('disabled');
			}
			// update building cost/amount
			var amountps = Game.calc.calcBdVPS(this),
				amountps1 = amountps * this.amount,
				amount = this.amount,
				cost = this.cost;
			if (Game.prefs.shortNums) {
				this.bdAmount.textContent = Tools.metricSuffix(amount);
				this.bdCost.textContent = Tools.metricSuffix(cost);
				this.tooltipAmount.textContent = Tools.metricSuffix(amount);
				this.tooltipCost.textContent = Tools.metricSuffix(cost);
				this.tooltipVPS.textContent = " " + Tools.metricSuffix(amountps1);
			} else {
				this.bdCost.textContent = Tools.beautify(cost) + " volts";
				this.bdAmount.textContent = Tools.beautify(amount);
				this.tooltipAmount.textContent = Tools.beautify(amount);
				this.tooltipCost.textContent = Tools.beautify(cost);
				this.tooltipVPS.textContent = " " + Tools.beautify(amountps1);
			}
			// update plurals
			this.tooltipProduceName = Math.round(this.amount) > 1 ? this.plural : this.single;
		}
		return options;
	};
})(window);