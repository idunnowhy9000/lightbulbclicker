define(['backbone', 'utils'],
	function (Backbone, utils) {
	
	var UpgradeModel = Backbone.Model.extend({
		
		initialize: function() {
			this.set('id', utils.toId(this.get('name')));
		},
		
		buy: function () {
			var AppModel = require('models/AppModel'); // prevent circular ref
			if (this.get('cost') > AppModel.get('volts')) return false;
			AppModel.remove(this.get('cost'));
			this.set('earned', true);
		},
		
		canDisplay: function () {
			var displayAt = this.get('displayAt');
			if (!displayAt) return false;
			
			var AppModel = require('models/AppModel');
			var type = displayAt[0],
				amount = displayAt[1],
				building = AppModel.buildingCollection.findWhere({ id: type });
			
			return (type === 'volts' && AppModel.get('volts') >= amount) ||
				   (type === 'level' && AppModel.levelModel.level >= amount) ||
				   (building && building.get('amount') >= amount);
		},
		
		defaults: {
			'name': 'None',
			'description': '...',
			'cost': 0,
			'earned': false,
			'displayed': false
		}
		
	});
	
	return UpgradeModel;
});