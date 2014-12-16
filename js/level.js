var Level = function (evoData) {
	this.level = 1;
	this.exp = 0;
	this.toNextLevel = 100;
	this.levelTotalExp = 0;
	this.levelCap = 100;
	this.levelN = {};
	this.levelUp = function () {
		this.level += 1;
		this.levelTotalExp += this.toNextLevel;
		this.toNextLevel = this.level * this.level * 100;
		this.evolve();
	}
	this.gainExp = function (exp) {
		//exp = parseInt(exp);
		var _results = [];
		this.exp += exp;
		if (this.level >= this.levelCap && this.exp > this.levelTotalExp) {
			this.exp = this.levelTotalExp;
		}
		while (this.exp >= this.levelTotalExp + this.toNextLevel && this.level < this.levelCap) {
			_results.push(this.levelUp());
		}
		this.update();
		return _results;
	}
	this.evolve = function () {
		for (var i in evoData) {
			var e = evoData[i];
			if (this.level >= e.evoLevel) {
				this.levelN.no = i;
				this.levelN.name = e.name;
			}
		}
	}
	this.update = function () {
		var self = this;
		Game.levelDisplay.text(this.level);
		Game.lvlExpDisplay.text(this.exp);
		Game.toNextLevelDisplay.text(this.toNextLevel - this.exp);
		Game.levelNDisplay.text(this.levelN.name);
		Game.pbarDisplay.css({
			width: ((self.exp / self.toNextLevel) * 100) + "%"
		}).attr({
			"aria-valuenow": ((self.exp / self.toNextLevel) * 100)
		});
	}
	return this;
};