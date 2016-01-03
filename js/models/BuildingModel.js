define(['backbone', 'underscore', 'utils'],
	function (Backbone, _, utils) {
	
	var BuildingModel = Backbone.Model.extend({
		
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
			this.updateCost();
		},
		
		// Buy
		buy: function (n) {
			var AppModel = require('models/AppModel');
			
			for (var i = 0; i < n; i++) {
				if (AppModel.get('volts') < this.get('cost')) {
					this.vps();
					return i;
				} else {
					AppModel.remove(this.get('cost'));
					utils.increment(this, 'amount');
					this.updateCost();
				}
			}
			
			this.vps();
			return n;
		},
		
		// Sell
		sell: function (n) {
			var AppModel = require('models/AppModel');
			
			for (var i = 1; i < n; i++) {
				if (this.get('amount') <= 0) {
					this.vps();
					return i;
				} else {
					utils.decrement(this, 'amount');
					this.updateCost();
					AppModel.earn(this.get('cost') * 0.25);
				}
			}
			
			this.vps();
			return n;
		},
		
		// Costs
		getCost: function (n) {
			return Math.floor(this.get('baseCost') * Math.pow(1.15, n));
		},
		
		getCurrentCost: function () {
			return this.getCost(this.get('amount'));
		},
		
		updateCost: function () {
			this.set('cost', this.getCurrentCost());
			return true;
		},
		
		// VPS functions
		vps: function () {
			var AppModel = require('models/AppModel');
			var self = this;
			
			var vps = this.get('baseVps');
			var amount = this.get('amount');
			var mult = 1;
			AppModel.upgradeCollection.each(function (upgrade) {
				if (upgrade.get('earned')) {
					var boost = upgrade.get('boost'),
						type = boost[0], amount = boost[1];
					if (type === self.id || type === 'all') {
						if (typeof amount === 'string' && amount.substring(0, 1) === 'x') {
							mult += Number(amount.substring(1, amount.length));
						} else {
							vps += amount;
						}
					}
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
			'displayAt': 100,
			'displayed': false,
			'amount': 0,
			
			'oneVps': 0,
			'vps': 0
		}
		
	});
	
	return BuildingModel;
});