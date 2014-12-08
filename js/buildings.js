var Building = function(options) {
	if (!options.name) options.name = 'None';
	if (!options.id) options.id = Game.toId(options.name);
	if (!options.description) options.description = '';
	if (!options.cost) options.cost = 10;
	if (!options.vps) options.vps = 1;
	options.amount = 0;
	if (!options.increase) options.increase = 1.15;
	if (!options.displayAt) options.displayAt = 1;
	options.type = 'building';
	options.displayed = false;
	options.button = undefined;
	options.check = function () {
		var self = this;
		if (this.cost > Game.volts) {
			this.button.addClass('disabled')
		} else {
			this.button.removeClass('disabled', 200);
			$('body').on('click', "#" + this.id, function() {
				self.buy();
			});
		}
	}
	options.buy = function() {
		if (this.cost > Game.volts) { return false; }
		Game._remove(this.cost);
		
		this.amount++;
		this.cost = Game.calc.calcCost(this);
		this.update();
	}
	options.update = function () {
		var self = this;
		if (!this.displayed) this.button.hide();
		if (Game.volts >= this.displayAt && !this.displayed) {
			this.displayed = true;
			this.button.fadeIn(400).css("display","");
		}
		$("#" + self.id + " .buildingAmount").text(self.amount);
		$("#" + self.id + " .buildingCost").text(Game.beautify(self.cost) + ' volts');
	}
	options.init = function() {
		var self = this;
		this.button = $("<div class='buildingObj btn btn-primary' id="+self.id+"></div>")
			.html("<div class='buildingAmount'>"+self.amount+"</div><div class='buildingInfo'><div id='buildingName'>"+self.name+"</div><div class='buildingCost'>"+Game.beautify(self.cost)+" volts</div>")
			.attr({
				"data-toggle": "tooltip",
				"data-placement": "bottom",
				"data-title": "" + this.description + "",
			})
			.tooltip({
				html: true
			});
		this.update();
		Game.store.append(this.button);
		this.check();
		return this;
	}
	return options;
};