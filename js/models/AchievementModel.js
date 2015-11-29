define(['backbone', 'utils'], function (Backbone, utils) {
	
	var Achievement = Backbone.Model.extend({
		
		initialize: function(){
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
		},
		
		defaults: {
			'name': 'None',
			'description': '...',
			'earned': false
		}
		
	});
	
	return Achievement;
});