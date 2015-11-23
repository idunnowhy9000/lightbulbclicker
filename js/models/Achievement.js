define(function () {
	var Achievement = function (Game, options) {
		if (!this.name) this.name = 'None';
		if (!this.id) this.id = Tools.toId(this.name);
		if (!this.description) this.description = '...';
		this.earned = false;
		this.game = Game;
		if (!this.onEarn || typeof this.onEarn !== 'function') this.onEarn = function (Game) {}
	};
	
	var AProto = Achievement.prototype;
	
	AProto.earn = function () {
		if (this.earned) return false;
		this.earned = true;
		this.onEarn(this.game);
		return true;
	};
	
	return Achievement;
});