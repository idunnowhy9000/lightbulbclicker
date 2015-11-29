define(['backbone', 'models/BuildingModel'],
	function (Backbone, BuildingModel) {
	
	var BuildingCollection = Backbone.Collection.extend({
		
		model: BuildingModel,
		
		vps: function () {
			return this.reduce(function (memo, value) {
				return memo + (value.get('vps') * value.get('amount'));
			}, 0);
		}
		
	});
	
	return BuildingCollection;
	
});