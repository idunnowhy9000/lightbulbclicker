define(['backbone', 'underscore', 'utils'],
	function (Backbone, _, utils) {
	
	var WorkerModel = Backbone.Model.extend({
		
		defaults: function () {
			return {
				'name': 'A worker',
				'level': 1,
				'toNextLevel': 100,
				'earned': false,
			};
		},
		
		getRps: function () {
			var AppModel = require('models/AppModel');
			
			var level = AppModel.levelModel.get('level');
			var worker_level = this.get('level');
			var research = Math.floor(worker_level * Math.pow(level, 1.15));
			
			this.set('rps', research);
			return research;
		},
		
		levelUp: function () {
			var AppModel = require('models/AppModel');
			var volts = AppModel.get('volts');
			var level = AppModel.levelModel.get('level');
			
			if (volts >= this.get('toNextLevel')) {
				utils.increment(this, 'level');
				AppModel.remove(this.get('toNextLevel'));
				this.set('toNextLevel', Math.round(25 * Math.pow(this.get('level'), 2) * Math.pow(level, 1.15)));
			}
		},
		
	});
	
	return WorkerModel;
	
});