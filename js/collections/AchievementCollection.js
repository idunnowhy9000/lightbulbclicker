define(['backbone', 'model/AchievementModel'],
	function (Backbone, AchievementModel) {
	
	var AchievementCollection = Backbone.Collection.extend({
		
		model: AchievementModel
		
	});
	
	return AchievementCollection;
	
});