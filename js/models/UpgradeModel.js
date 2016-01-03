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
				building;
			
			if (type === 'volts') {
				return AppModel.get('volts') >= amount;
			} else if (type === 'click') {
				return AppModel.get('clicked') >= amount;
			} else if (type === 'level') {
				return AppModel.levelModel.level >= amount;
			} else if ( (building = AppModel.buildingCollection.findWhere({ id: type })) ) {
				return building.get('amount') >= amount;
			} else {
				return this.get('displayable');
			}
		},
		
		defaults: {
			'name': 'None',
			'description': '...',
			'cost': 0,
			'earned': false,
			'displayed': false,
			'displayable': false,
			'boost': []
		}
		
	});
	
	return UpgradeModel;
});