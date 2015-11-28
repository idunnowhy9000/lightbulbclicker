define(['backbone', 'utils'], function (Backbone, utils) {
	
	var Building = Backbone.Model.extend({
		
		initialize: function(){
			this.baseCost = this.get('cost');
			
			this.updateAttributes();
			this.on("change", this.updateAttributes, this);
		},
		
		earn: function () {
			if (this.get('earned')) return false;
			this.set('earned', true);
			return true;
		},
		
		updateAttributes: function () {
			this.set('id', utils.toId(this.get('name')));
			var commonName = this.get('commonName').split('|');
			this.set('single', commonName[0] || this.get('name'));
			this.set('plural', (options.commonName[1] === '0' ? (options.single + "s") : options.commonName[1]) || options.name + 's');
			this.set('actionName', options.commonName[2] || 'producing');
		},
		
		defaults: {
			'name': 'None',
			'description': '...',
			'commonName': '||',
			'earned': false,
			'cost': 10,
			'vps': 1,
			'increase': 1.15,
			'displayAt': 100,
			'displayable': true,
			'displayed': false
		}
		
	});
	
	return Building;
});