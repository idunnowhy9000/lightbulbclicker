define(['jquery', 'underscore', 'backbone', 'utils',
	'collections/AchievementCollection', 'collections/BuildingCollection', 'collections/UpgradeCollection',
	'models/levelModel',
	'data/Achievements', 'data/Buildings', 'data/Upgrades'],
	function ($, _, Backbone, utils,
		AchievementCollection, BuildingCollection, UpgradeCollection,
		LevelModel,
		AchievementData, BuildingData, UpgradeData) {
	
	var localStorage = window.localStorage;
	var btoa = window.btoa;
	var atob = window.atob;
	var isNaN = window.isNaN;
	
	var AppModel = Backbone.Model.extend({
		
		defaults: {
			'volts': 0,
			'voltsTot': 0,
			'voltsTotAll': 0,
			'curDate': new Date(),
			
			// stats
			'clicked': 0,
			'vps': 0,
			'm_vps': 0,
			'sessionStart': new Date(),
			'gameStart': new Date(),
			'factName': 'Your Factory',
			'nameSettable': false,
			'timeTravelAble': false,
			
			// settings
			'autosave': 120,
		},
		
		version: 2.016,
		
		initialize: function () {
			this.buildingCollection = new BuildingCollection(BuildingData);
			this.upgradeCollection = new UpgradeCollection(UpgradeData);
			this.achievementCollection = new AchievementCollection();
			this.levelModel = new LevelModel();
			
			this.logicElasped = 0;
			this.autoSaveElapsed = 0;
			
			this.loop();
			this.fetch();
			
			this.listenTo(this.buildingCollection, 'change', this.calcVPS);
			this.listenTo(this.upgradeCollection, 'change', this.calcVPS);
		},
		
		loop: function () {
			this.logicElasped++;
			this.autoSaveElapsed++;
			
			if (this.logicElasped >= 1) {
				this.logic();
				this.logicElasped = 0;
			}
			
			if (this.get('autosave') && this.autoSaveElapsed >= this.get('autosave')) {
				this.save();
				this.autoSaveElapsed = 0;
			}
			
			var self = this;
			this.timeout = setTimeout(function () {
				self.loop();
			}, 1000);
		},
		
		logic: function () {
			if (this.get('vps')) this.earn(this.get('vps'));
		},
		
		// save load
		sync: function (method, model, options) {
			if (method === 'create' || method === 'update') {
				var saveData = [];
				saveData.push(this.version);
				saveData.push(this.get('volts'));
				saveData.push(this.get('voltsTot'));
				saveData.push(this.get('voltsTotAll'));
				
				// stats
				saveData.push(this.get('sessionStart').getTime());
				saveData.push(this.get('gameStart').getTime());
				saveData.push(this.get('clicked'));
				saveData.push(this.get('factName'));
				saveData.push(this.get('nameSettable'));
				
				// buildings
				var buildingsAmount = [];
				this.buildingCollection.each(function (building) {
					buildingsAmount.push(building.get('amount'));
				});
				saveData.push(buildingsAmount.join(','));
				
				// upgrades
				var upgradesAmount = [];
				this.upgradeCollection.each(function (upgrade) {
					upgradesAmount.push(upgrade.get('amount'));
				});
				saveData.push(upgradesAmount.join(","));
				
				// levels
				saveData.push(this.levelModel.get('level'));
				saveData.push(this.levelModel.get('exp'));
				saveData.push(this.levelModel.get('toNextLevel'));
				saveData.push(this.levelModel.get('levelTotalExp'));
				saveData.push(this.levelModel.get('levelN'));
				
				// VPS
				saveData.push(this.get('vps'));
				saveData.push(this.get('m_vps'));
				
				var saveString = btoa(saveData.join('!'));
				saveString += '%21END%21'; // make sure base64 works
				
				localStorage.setItem('LBClicker', saveString);
				options.success();
				
			} else if (method === 'delete') {
				
				delete localStorage.LBClicker;
				options.success();
				
			} else if (method === 'read') {
				
				if (options.save) {
					var saveData = options.save;
				} else if (localStorage.hasOwnProperty('LBClicker')) {
					var saveData = localStorage.getItem('LBClicker');
				}
				
				if (!/%21END%21$/.test(saveData)) {
					return options.error('Invalid save file.');
				} else {
					saveData = saveData.replace('%21END%21', '');
				}
				
				try {
					var decoded = atob(saveData).split('!'),
						version = parseFloat(decoded[0]);
				} catch (e) {
					if (e instanceof InvalidCharacterError) {
						return options.error('String is not a save file.');
					}
				}
				
				if (isNaN(version)) {
					return options.error('Your save file version is invalid.');
				}
					
				if (version > this.version) {
					return options.error('Your save file is from a future version.');
				} else if (version < 2) {
					return options.error("Can't read version <2.0 save files.");
				}
				
				var i = 1;
				
				this.set('volts', parseFloat(decoded[i++]) || 0);
				this.set('voltsTot', parseFloat(decoded[i++]) || 0);
				this.set('voltsTotAll', parseFloat(decoded[i++]) || 0);

				this.set('sessionStart', new Date(parseInt(decoded[i++])));
				this.set('gameStart', new Date(parseInt(decoded[i++])));
				this.set('clicked', parseFloat(decoded[i++]) || 0);
				this.set('factName', decoded[i++] || "");
				this.set('nameSettable', decoded[i++] || false);

				// buildings
				var buildings = decoded[i++].split(',');
				this.buildingCollection.each(function (building, index) {
					building.set('amount', parseInt(buildings[index]) || 0);
				});

				var upgrades = decoded[i++].split(',');
				this.upgradeCollection.each(function (upgrade, index) {
					upgrade.set('earned', buildings[index] || false);
				});

				// levels
				this.levelModel.set('level', parseFloat(decoded[i++]) || 0);
				this.levelModel.set('exp', parseFloat(decoded[i++]) || 0);
				this.levelModel.set('toNextLevel', parseFloat(decoded[i++]) || 0);
				this.levelModel.set('levelTotalExp', parseFloat(decoded[i++]) || 0);
				this.levelModel.set('levelN', parseFloat(decoded[i++]) || 0);
				
				this.set('vps', parseFloat(decoded[i++]) || 0);
				this.set('m_vps', parseFloat(decoded[i++]) || 0);
				
				options.success();
			}
		},
		
		reset: function () {
			this.buildingCollection.each(function (building) {
				building.set('amount', 0)
						.set('cost', building.get('baseCost'));
			});
			
			this.upgradeCollection.each(function (upgrade) {
				upgrade.set('earned', false)
					.set('displayed', false);
			});
			
			this.levelModel.set(this.levelModel.defaults);
			this.set(this.defaults);
			
			this.destroy();
			return this;
		},
		
		// volts per second calculator
		calcVPS: function () {
			var vps = this.buildingCollection.vps();
			this.set('vps', vps);
			this.trigger('volts');
		},
		
		calcMouseVPS: function () {
			var vps = 0, mult = 1;
			this.upgradeCollection.each(function (upgrade) {
				_.each(upgrade.boost, function (boost) {
					var type = boost[0], amount = boost[1];
					if (type === 'click') {
						if (typeof amount === 'string' && amount.substring(0, 1) === 'x') {
							mult += Number(amount.substring(1, amount.length));
						} else {
							vps += amount;
						}
					}
				});
			});
			this.set('m_vps', vps * mult);
		},
		
		// volts manipulator
		click: function () {
			this.levelModel.earnExp(1);
			this.earn(1);
			
			utils.increment(this, 'clicked');
		},
		
		earn: function (n) {
			utils.increment(this, 'volts', n);
			utils.increment(this, 'voltsTot', n);
			utils.increment(this, 'voltsTotAll', n);
			this.trigger('volts');
		},
		
		remove: function (n) {
			utils.decrement(this, 'volts', n);
			this.trigger('volts');
		}
		
	});
	
	return new AppModel();
	
});