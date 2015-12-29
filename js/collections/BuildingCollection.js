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
		}
		
	});
	
	return BuildingCollection;
	
});