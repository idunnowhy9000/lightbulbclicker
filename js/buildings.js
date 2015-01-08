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
			
			Game.store.appendChild(btnHolder);
			this.btnHolder = btnHolder;
			this.button = tempBtn;
			this.bdCost = bdCost;
			this.bdAmount = bdAmount;
		}
		options.refresh = function () {
			if (!options.displayed) this.btnHolder.classList.add('hidden');
			if (Game.volts >= this.displayAt && !this.displayed) {
				this.displayed = true;
				this.btnHolder.classList.remove('hidden');
			}
			if (this.cost > Game.volts) {
				this.button.classList.add('disabled');
			} else {
				this.button.classList.remove('disabled');
			}
			// update building cost/amount
			var amountps = Game.calc.calcBdVPS(this),
				amountps1 = amountps * this.amount,
				amount = Tools.beautify(this.amount),
				cost = Tools.beautify(this.cost);
			this.bdAmount.textContent = amount;
			if (Game.prefs.shortNums === 0) {
				this.bdCost.textContent = cost + " volts";
			} else {
				this.bdCost.textContent = Tools.metricSuffix(cost);
			}
		}
		return options;
	};
})(window);