define(['backbone', 'utils'],
	function (Backbone, utils) {
	
	var LevelModel = Backbone.Model.extend({
		defaults: {
			'exp': 0,
			'level': 1,
			'toNextLevel': 100,
			'levelTotalExp': 0
		},
		
		levelUp: function () {
			utils.increment(this, 'level');
			utils.increment(this, 'levelTotalExp', this.get('toNextLevel'));
			this.set('toNextLevel', this.get('level') * this.get('level') * 100);
		},
		
		earnExp: function (_exp) {
			utils.increment(this, 'exp', _exp);
			while (this.get('exp') >= this.get('toNextLevel')) {
				this.levelUp();
			}
		}
	});
	
	return LevelModel;
	
});