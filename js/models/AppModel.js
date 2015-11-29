define(["jquery", "underscore", "backbone", "localStorage",
	"collections/AchievementCollection", "collections/BuildingCollection", "collections/UpgradeCollection",
	"data/Achievements", "data/Buildings", "data/Upgrades"],
	function ($, _, Backbone, Store,
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
			'vps': 0,
			'sessionStart': new Date(),
			'gameStart': new Date(),
			'factName': 'Your Factory',
			'nameSettable': false,
			'timeTravelAble': false,
		},
		
		localStorage: new Backbone.LocalStorage('App'),
		
		initialize: function () {
			this.buildingCollection = new BuildingCollection(BuildingData);
			this.upgradeCollection = new UpgradeCollection(UpgradeData);
			this.achievementCollection = new AchievementCollection();
			
			this.logic();
			
			this.listenTo(this.buildingCollection, 'change:amount', this.calcVPS);
		},
		
		logic: function () {
			var self = this;
			
			if (self.get('vps')) self.earn(self.get('vps'));
			
			this.timeout = setTimeout(function () {
				self.logic();
			}, 1000);
		},
		
		calcVPS: function () {
			var vps = this.buildingCollection.vps();
			this.set('vps', vps);
			this.trigger('volts');
		},
		
		earn: function (n) {
			this.set('volts', this.get('volts') + n);
			this.set('voltsTot', this.get('voltsTot') + n);
			this.set('voltsTotAll', this.get('voltsTotAll') + n);
			this.trigger('volts');
		},
		
		remove: function (n) {
			this.set('volts', this.get('volts') - n);
			this.trigger('volts');
		}
		
	});
	
	return new AppModel();
	
});