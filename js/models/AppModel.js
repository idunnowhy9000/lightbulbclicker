define(["jquery", "underscore", "backbone", "localStorage",
	"models/AchievementModel", "models/BuildingModel", "models/UpgradeModel",
	"views/AchievementView", "views/BuildingView", "views/UpgradeView",
	"collections/AchievementCollection", "collections/BuildingCollection", "collections/UpgradeCollection",
	"data/Achievements", "data/Buildings", "data/Upgrades"],
	function ($, _, Backbone, Store,
		AchievementModel, BuildingModel, UpgradeModel,
		AchievementView, BuildingView, UpgradeView,
		AchievementCollection, BuildingCollection, UpgradeCollection,
		AchievementData, BuildingData, UpgradeData) {

	var AppModel = Backbone.Model.extend({
		
		defaults: {
			'volts': 0,
			'voltsTot': 0,
			'voltsTotAll': 0,
			'prestiege': 0,
			'curDate': new Date(),
			
			// stats
			'clicked': 0,
			'_vps': 0,
			'sessionStart': new Date(),
			'gameStart': new Date(),
			'factName': 'Your Factory',
			'nameSettable': false,
			'timeTravelAble': false,
		},
		
		localStorage: new Backbone.LocalStorage('App'),
		
		initialize: function () {
			this.buildingCollection = new BuildingCollection();
			this.upgradeCollection = new UpgradeCollection();
			this.achievementCollection = new AchievementCollection();
			
			_.each(BuildingData, function (data) {
				this.buildingCollection.add(data);
			}, this);
		},
		
		earn: function (n) {
			this.set('volts', this.get('volts') + n);
			this.set('voltsTot', this.get('voltsTot') + n);
			this.set('voltsTotAll', this.get('voltsTotAll') + n);
			this.trigger('volts', n);
		},
		
	});
	
	return new AppModel();
	
});