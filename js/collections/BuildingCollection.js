define(['backbone', 'models/BuildingModel'],
	function (Backbone, BuildingModel) {
	
	var BuildingCollection = Backbone.Collection.extend({
		
		model: BuildingModel,
		
		vps: function () {
			var AppModel = require('models/AppModel');
			
			var vps = 0;
			this.each(function (building) {
				vps += building.vps();
			});
			
			var level = 0;
			AppModel.upgradeCollection.each(function (upgrade) {
				if (upgrade.get('earned')) {
					var boost = upgrade.get('boost');
					if (boost[0] === 'level') {
						level = Math.max(level, boost[1]);
					}
				}
			});
			vps *= (1 + AppModel.levelModel.get('level') * level);
			
			return vps;
		}
		
	});
	
	return BuildingCollection;
	
});