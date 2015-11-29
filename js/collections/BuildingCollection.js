define(['backbone', 'models/BuildingModel'],
	function (Backbone, BuildingModel) {
	
	var BuildingCollection = Backbone.Collection.extend({
		
		model: BuildingModel,
		
		vps: function () {
			return this.reduce(function (memo, value) {
				return memo + value.vps();
			}, 0);
		}
		
	});
	
	return BuildingCollection;
	
});