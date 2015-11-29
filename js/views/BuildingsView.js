define(['backbone',
	'views/BuildingView'],
	function (Backbone, BuildingView) {
	
	var BuildingsView = Backbone.View.extend({
		
		tagName: 'div',
		id: 'lightbulb',
		
		render: function () {
			this.collection.each(function (building) {
				console.log(building);
				var buildingView = new BuildingView({ model: building });
				this.$el.append(buildingView.render().el);
			}, this);
			return this;
		}
		
	});
	
	return BuildingsView;
	
});