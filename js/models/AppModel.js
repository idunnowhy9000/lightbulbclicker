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
			'version': 2.016,
			
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
			'autosave': 120
		},
		
		initialize: function () {
			var self = this;
			this.buildingCollection = new BuildingCollection(BuildingData);
			this.upgradeCollection = new UpgradeCollection(UpgradeData);
			this.achievementCollection = new AchievementCollection();
			this.levelModel = new LevelModel();
			
			this.logicElasped = 0;
			this.autoSaveElapsed = 0;
			
			this.loop();
			this.fetch();
			
			this.listenTo(this.buildingCollection, 'change:amount', function () {
				self.calcVPS();
				self.calcMouseVPS();
				self.buildingsOwned();
			});
			
			this.listenTo(this.upgradeCollection, 'change:earned', function () {
				self.calcVPS();
				self.calcMouseVPS();
			});
			
			// hack to calc vps
			setTimeout(function () {
				self.calcVPS();
				self.calcMouseVPS();
			}, 1000);
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
				saveData.push(this.get('version'));
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
					upgradesAmount.push(upgrade.get('earned') ? '1' : '0');
				});
				saveData.push(upgradesAmount.join(','));
				
				// levels
				saveData.push(this.levelModel.get('level'));
				saveData.push(this.levelModel.get('exp'));
				saveData.push(this.levelModel.get('toNextLevel'));
				saveData.push(this.levelModel.get('levelTotalExp'));
				
				// VPS
				saveData.push(this.get('vps'));
				saveData.push(this.get('m_vps'));
				
				// options
				saveData.push(this.get('autosave'));
				
				var saveString = btoa(saveData.join('!'));
				saveString += '%21END%21'; // make sure base64 works
				
				localStorage.setItem('LBClicker', saveString);
				this.trigger('save');
				options.success();
				
			} else if (method === 'delete') {
				
				localStorage.removeItem('LBClicker');
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
					
				if (version > this.get('version')) {
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
				this.set('factName', decoded[i++] || '');
				this.set('nameSettable', decoded[i++] || 'Your Factory');

				// buildings
				var buildings = decoded[i++].split(',');
				this.buildingCollection.each(function (building, index) {
					building.set('amount', parseInt(buildings[index]) || 0);
				});

				var upgrades = decoded[i++].split(',');
				this.upgradeCollection.each(function (upgrade, index) {
					upgrade.set('earned', upgrades[index] === '1');
				});

				// levels
				this.levelModel.set('level', parseFloat(decoded[i++]) || 0);
				this.levelModel.set('exp', parseFloat(decoded[i++]) || 0);
				this.levelModel.set('toNextLevel', parseFloat(decoded[i++]) || 0);
				this.levelModel.set('levelTotalExp', parseFloat(decoded[i++]) || 0);
				
				options.success();
			}
		},
		
		reset: function () {
			this.buildingCollection.each(function (building) {
				building.set('amount', 0)
						.set('cost', building.get('baseCost'))
						.set('displayed', false);
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
			var self = this;
			var vps = 1, mult = 1;
			this.upgradeCollection.each(function (upgrade) {
				if (upgrade.get('earned')) {
					var boost = upgrade.get('boost'),
						type = boost[0], amount = boost[1];
					if (type === 'click') {
						if (typeof amount === 'string' && amount[0] === 'x') {
							console.log(amount);
							mult += Number(amount.substring(1, amount.length));
						} else if (amount === 'building') {
							vps += boost[2] * self.get('buildingsOwned');
						} else {
							vps += amount;
						}
					}
				}
			});
			var totalVps = vps * mult;
			this.set('m_vps', totalVps);
			return totalVps;
		},
		
		// volts manipulator
		click: function () {
			var m_vps = this.get('m_vps') || this.calcMouseVPS();
			
			this.levelModel.earnExp(m_vps);
			this.earn(m_vps);
			utils.increment(this, 'clicked');
			
			return m_vps;
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
		},
		
		// stats
		buildingsOwned: function () {
			var buildings = 0;
			this.buildingCollection.each(function (building) {
				buildings += building.amount;
			});
			this.set('buildingsOwned', buildings);
			return buildings;
		}
		
	});
	
	return new AppModel();
	
});