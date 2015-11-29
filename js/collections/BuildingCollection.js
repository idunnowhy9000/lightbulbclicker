define(['backbone', 'models/BuildingModel'],
	function (Backbone, BuildingModel) {
	
	var BuildingCollection = Backbone.Collection.extend({
		
		model: BuildingModel
		
	});
	
	return BuildingCollection;
	
});