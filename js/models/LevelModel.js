define(['backbone', 'utils'],
	function (Backbone, utils) {
	
	var LevelModel = Backbone.Model.extend({
		defaults: {
			'exp': 0,
			'level': 1,
			'toNextLevel': 100,
			'levelTotalExp': 0,
			'levelCap': 999
		},
		
		levelUp: function () {
			utils.increment(this, 'level');
			utils.increment(this, 'levelTotalExp', this.get('toNextLevel'));
			this.set('toNextLevel', this.get('level') * this.get('level') * 100);
		},
		
		earnExp: function (_exp) {
			var exp = this.get('exp'),
				level = this.get('level'),
				totalExp = this.get('levelTotalExp'),
				levelCap = this.get('levelCap'),
				toNextLevel = this.get('toNextLevel');
			_exp = Math.round(_exp);
			
			utils.increment(this, 'exp', _exp);
			
			if (level >= levelCap && exp > totalExp) {
				this.set('exp', totalExp);
			}
			while (exp >= totalExp + toNextLevel && level < levelCap) {
				this.levelUp();
			}
		}
	});
	
	return LevelModel;
	
});