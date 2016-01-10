define(['backbone', 'models/BuildingModel'],
	function (Backbone, BuildingModel) {
	
	var BuildingCollection = Backbone.Collection.extend({
		
		model: BuildingModel,
		
		vps: function () {
			var vps = 0;
			this.each(function (building) {
				vps += building.vps();
			});
			return vps;
		},
		
		updateCost: function () {
			this.each(function (building) {
				building.updateCost();
			});
		},
		
		buildingsOwned: function () {
			var buildings = 0;
			this.each(function (building) {
				buildings += building.get('amount');
			});
			return buildings;
		},
		
	});
	
	return BuildingCollection;
	
});