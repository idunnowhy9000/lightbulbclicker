define(['backbone', 'utils'],
	function (Backbone, utils) {
	
	var Building = Backbone.Model.extend({
		
		initialize: function(){
			var id = utils.toId(this.get('name')),
				commonName = this.get('commonName').split('|'),
				single = commonName[0] || this.get('name'),
				plural = (commonName[1] === '0' ? (this.single + "s") : commonName[1]) || name + 's',
				actionName = (commonName[2] || 'producing');
			
			this.set('id', id);
			this.set('single', single);
			this.set('plural', plural);
			this.set('actionName', actionName);
			this.set('baseCost', this.get('cost'));
		},
		
		buy: function () {
			var AppModel = require('models/AppModel'); // prevent circular ref
			if (this.get('cost') > AppModel.get('volts')) return false;
			AppModel.remove(this.get('cost'));
			
			this.set('amount', this.get('amount') + 1);
			this.set('cost', this.calculateCost());
		},
		
		calculateCost: function () {
			return Math.round(this.get('cost') * Math.pow(this.get('increase'), this.get('amount')));
		},
		
		defaults: {
			'name': 'None',
			'description': '...',
			'commonName': '||',
			'cost': 10,
			'vps': 1,
			'increase': 1.15,
			'displayAt': 100,
			'displayable': true,
			'displayed': false,
			'amount': 0
		}
		
	});
	
	return Building;
});