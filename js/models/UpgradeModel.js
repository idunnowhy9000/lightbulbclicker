define(['backbone', 'utils'], function (Backbone, utils) {
	
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
		
		defaults: {
			'name': 'None',
			'description': '...',
			'earned': false
		}
		
	});
	
	return UpgradeModel;
});