define(['backbone', 'model/Building'], function (Backbone, BuildingModel) {
	
	var BuildingCollection = Backbone.Collection.extend({
		
		model: BuildingModel
		
	});
	
	return BuildingCollection;
	
});