define(['backbone', 'model/UpgradeModel'],
	function (Backbone, UpgradeModel) {
	
	var UpgradeCollection = Backbone.Collection.extend({
		
		model: UpgradeModel
		
	});
	
	return UpgradeCollection;
	
});