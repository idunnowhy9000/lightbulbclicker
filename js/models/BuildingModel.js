define(['backbone', 'utils'], function (Backbone, utils) {
	
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
			
			//this.updateAttributes();
			//this.on("change", this.updateAttributes, this);
		},
		
		earn: function () {
			if (this.get('earned')) return false;
			this.set('earned', true);
			return true;
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
			'displayed': false,
			'amount': 0
		}
		
	});
	
	return Building;
});