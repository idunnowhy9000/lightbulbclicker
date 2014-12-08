var Upgrade = function(options) {
	if (!options.name) options.name = 'None';
	if (!options.id) options.id = Game.toId(options.name);
	if (!options.description) options.description = '';
	if (!options.cost) options.cost = 10;
	if (!options.vps) options.boost = [["all",0]];
	options.amount = 0;
	if (!options.displayAt) options.displayAt = 1;
	options.displayed = false;
	options.button = undefined;
	options.buy = function() {
		if (this.cost > Game.volts || this.amount === 1) return;
		Game._remove(this.cost);
		
		this.amount = 1;
		this.update();
	}
	options.update = function () {
		var self = this;
		if (this.amount === 1) { this.button.hide(); return; }
		if (!this.displayed) this.button.hide();
		if (Game.volts >= this.displayAt) {
			this.button.fadeIn(400).css("display","");
			this.displayed = true;
		}
	}
	options.init = function() {
		var self = this;
		this.button = $("<div class='upgradeObj btn btn-primary' id="+self.id+"></div>")
			.html("<div class='upgradeInfo'><div id='upgradeName'>"+self.name+"</div><div class='upgradeCost'>"+Game.beautify(self.cost)+" volts</div>")
			.click(function () {
				self.buy()
			})
			//.hide()
		this.update();
		Game.upgradeStore.append(this.button);
		return this;
	}
	return options;
};