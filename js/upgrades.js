var Upgrade = function(options) {
	if (!options.name) options.name = 'None';
	if (!options.id) options.id = Game.toId(options.name);
	if (!options.description) options.description = '...';
	if (!options.cost) options.cost = 0;
	if (!options.vps) options.boost = [["all",0]];
	options.amount = 0;
	if (!options.displayAt) options.displayAt = [];
	if (!options.onBuy) options.onBuy = function () {}
	options.displayed = false;
	options.button = undefined;
	options.check = function () {
		var self = this;
		if (this.cost > Game.volts) {
			this.button.addClass('fakeDisable')
		} else {
			this.button.removeClass('fakeDisable', 200);
		}
	}
	options.buy = function() {
		if (this.cost > Game.volts || this.amount === 1) return;
		Game._remove(this.cost);
		
		this.amount = 1;
		Game._calcVPS();
		this.onBuy();
		this.update();
	}
	options.update = function () {
		var self = this;
		if (this.amount === 1) { this.button.hide(); return; }
		if (!this.displayed) this.button.hide();
		var canDisplay = false;
		if ((Game.buildings[this.displayAt[0]] && Game.buildings[this.displayAt[0]].amount >= this.displayAt[1]) || (this.displayAt[0] === 'volts' && Game.volts >= this.displayAt[1])) {
			canDisplay = true;
		}
		if (canDisplay) {
			this.button.fadeIn(400).css("display","");
			this.displayed = true;
		}
	}
	options.init = function() {
		var self = this;
		this.button = $("<div class='upgradeObj' id="+self.id+"></div>")
			.css({
				"background-image": "url(img/upgrades/" + self.id + ".png)",
				"width": 64,
				"height": 64,
				"float": "left"
			})
			.attr({
				"data-toggle": "tooltip",
				"data-placement": "bottom",
				"title": this.name,
				"data-content": "<p class='upFunc'>" + this.description + "</p><p>Costs <span id='upCost'>" + Game.beautify(this.cost) + "</span> volts</p>",
			})
			.popover({
				trigger: 'hover',
				html: true,
				container:'body'
			})
			.click(function () {
				self.buy()
			})
		this.update();
		Game.upgradeStore.append(this.button);
		this.check();
		return this;
	}
	return options;
};