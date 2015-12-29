define(['backbone', 'utils'],
	function (Backbone, utils) {
	
	var LevelModel = Backbone.Model.extend({
		defaults: {
			'level': 1,
			'exp': 0,
			'toNextLevel': 100,
			'neededToNext': 100,
			'levelTotalExp': 0,
			'levelCap': 999,
			'levelName': ''
		},
		
		levelUp: function () {
			utils.increment(this, 'level');
			utils.increment(this, 'levelTotalExp', this.get('toNextLevel'));
			utils.increment(this, 'toNextLevel', Math.pow(this.get('level'), 2) * 100);
		},
		
		earnExp: function (exp) {
			utils.increment(this, 'exp', exp);
			if (this.get('level') >= this.get('levelCap') && this.get('exp') > this.get('levelTotalExp')) {
				this.set('exp', this.get('levelTotalExp'));
			}
			while (this.get('exp') >= this.get('levelTotalExp') + this.get('toNextLevel') &&
				this.get('level') < this.get('levelCap')) {
				this.levelUp()
			}
			this.set('neededToNext', this.get('toNextLevel') - this.get('exp'));
		},
		
		percent: function () {
			return this.get('exp') / this.get('toNextLevel') * 100;
		}
	});
	
	return LevelModel;
	
});