define(['backbone',
	'views/BuildingView'],
	function (Backbone, BuildingView) {
	
	var BuildingsView = Backbone.View.extend({
		
		tagName: 'div',
		id: 'lightbulb',
		
		render: function () {
			var self = this;
			this.$el.empty();
			this.collection.each(function (building) {
				var buildingView = new BuildingView({ model: building });
				self.$el.append(buildingView.render().el);
			});
			return this;
		},
		
	});
	
	return BuildingsView;
	
});