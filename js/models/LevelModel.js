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
			try { // i promise i will fix this
			var AppModel = require('models/AppModel'),
				vps = AppModel.get('vps');
			}catch(e){vps=0;}
			
			utils.increment(this, 'level');
			utils.increment(this, 'levelTotalExp', this.get('toNextLevel'));
			this.set('toNextLevel', Math.pow(this.get('level'), 3) * 100);
			//this.set('toNextLevel', Math.pow(this.get('level'), 3) * Math.sqrt(vps) * 100);
		},
		
		earnExp: function (_exp) {
			utils.increment(this, 'exp', _exp);
			while (this.get('exp') >= this.get('toNextLevel') + this.get('levelTotalExp')) {
				this.levelUp();
			}
		}
	});
	
	return LevelModel;
	
});