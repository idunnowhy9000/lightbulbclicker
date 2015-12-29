define(['backbone', 'underscore', 'utils'],
	function (Backbone, _, utils) {
	
	var Building = Backbone.Model.extend({
		
		initialize: function(){
			var id = utils.toId(this.get('name')),
				commonName = this.get('commonName').split('|'),
				single = commonName[0] || this.get('name'),
				plural = (commonName[1] ? commonName[1] : (single + 's')),
				actionName = (commonName[2] || 'producing');
			
			this.set('id', id);
			this.set('single', single);
			this.set('plural', plural);
			this.set('actionName', actionName);
			this.set('cost', this.get('baseCost'));
		},
		
		buy: function () {
			var AppModel = require('models/AppModel'); // prevent circular ref
			if (this.get('cost') > AppModel.get('volts')) return false;
			AppModel.remove(this.get('cost'));
			
			utils.increment(this, 'amount');
			this.calculateCost();
		},
		
		calculateCost: function () {
			var cost = Math.round(this.get('baseCost') * Math.pow(this.get('increase'), this.get('amount')));
			this.set('cost', cost);
			return cost;
		},
		
		vps: function () {
			var AppModel = require('models/AppModel');
			var self = this;
			
			var vps = this.get('baseVps');
			var amount = this.get('amount');
			var mult = 1;
			AppModel.upgradeCollection.each(function (upgrade) {
				if (upgrade.earned) {
					_.each(upgrade.boost, function (boosts) {
						var type = boosts[0], amount = boosts[1];
						if (type === self.id || type === 'all') {
							if (typeof amount === 'string' && amount.substring(0, 1) === 'x') {
								mult += Number(amount.substring(1, amount.length));
							} else {
								vps += amount;
							}
						}
					});
				}
			});
			
			var totalVps = (vps * amount) * mult;
			this.set('oneVps', vps);
			this.set('vps', totalVps);
			return totalVps;
		},
		
		defaults: {
			'name': 'None',
			'description': '...',
			'commonName': '||',
			'baseCost': 10,
			'baseVps': 1,
			'increase': 1.15,
			'displayAt': 100,
			'displayable': true,
			'displayed': false,
			'amount': 0,
			
			'oneVps': 0,
			'vps': 0
		}
		
	});
	
	return Building;
});