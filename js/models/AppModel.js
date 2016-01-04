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
			'autosave': 60
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
				self.buildingCollection.updateCost();
			});
			
			this.listenTo(this.upgradeCollection, 'change:earned', function () {
				self.calcVPS();
				self.calcMouseVPS();
			});
			
			// hack to calc vps
			_.defer(function () {
				self.calcVPS();
				self.calcMouseVPS();
			});
			
			this.buildingCollection.updateCost();
			
			// optimize for click upgrades
			this.clickUpgrades = this.upgradeCollection.filter(function (upgrade) {
				return upgrade.get('boost')[0] === 'click';
			});
			
			this.levelUpgrades = this.upgradeCollection.filter(function (upgrade) {
				return upgrade.get('boost')[0] === 'level';
			});
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
		sync: function (method, model, options) {console.log(method);
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
					if (upgrade.get('earned')) upgradesAmount.push(upgrade.get('id'));
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
				
				localStorage.setItem('LBClicker', saveData.join('!'));
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
				} else {
					return options.error('Save file not found.');
				}
				
				var decoded = saveData.split('!'),
					version = parseFloat(decoded[0]);
				
				if (!decoded.length) {
					return options.error('Your save file is invalid.');
				}
				
				if (isNaN(version)) {
					return options.error('Your save file version is invalid.');
				}
					
				if (version > this.get('version')) {
					return options.error('Your save file is from a future version.');
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
					if (upgrade.get('id') === upgrades[index]) {
						upgrade.set('earned', true);
					}
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
			this.clear().set(this.defaults);
			
			this.destroy();
			return this;
		},
		
		// volts per second calculator
		calcVPS: function () {
			var vps = this.buildingCollection.vps();
			
			var level = 0;
			this.levelUpgrades.each(function (upgrade) {
				if (upgrade.get('earned')) {
					var boost = upgrade.get('boost');
					level = Math.max(level, boost[1]);
				}
			});
			vps *= (1 + this.levelModel.get('level') * level);
			
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
			
			this.earn(m_vps);
			this.levelModel.earnExp(m_vps);
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
		
		// story ticker
		storyTicker: function () {
			var volts = this.get('volts'), story;
			if (volts === 1) story = 'You are a mechanic, you work for an electric factory.';
			else if (volts === 2) story = 'Your bright idea for a new power source has emerged, using lightbulbs to generate power.';
			else if (volts === 3) story = 'Your boss has denied your proposal, saying, "That\'s not possible, and it never will"';
			else if (volts === 4) story = "You feel sad, however you won't give up.";
			else if (volts === 5) story = 'You spin your bicycle wheels to generate power. Your adventure begins.';
			else if (volts === 15) story = 'You have enough energy to buy a lightbulb.';
			else if (volts === 50) story = 'You have enough energy to charge your own phone.';
			else if (volts === 100) story = 'You have enough energy to charge a laptop.';
			else if (volts === 500) story = 'Your house is now using your energy.';
			else if (volts === 1000) story = 'Your local coffee shop are now using your energy!';
			else if (volts === 5000) story = 'Your local coffee shop are now using your energy!';
			else if (volts === 10000) story = 'People from miles around are now using your energy!';
			else if (volts === 50000) story = 'Foreigners are using your energy!';
			else if (volts === 100000) story = 'Your factory now starts growing, 5 employees a day.';
			else if (volts === 125000) story = "You've open your official company!";
			else if (volts === 150000) story = 'Your company now owns a website!';
			else if (volts === 200000) story = 'Distant countries are paying for your power.';
			else if (volts === 500000) story = 'Your company now starts growing, 10 employees a day.';
			else if (volts === 1000000) story = 'Your company has been expanded to seas and nations!';
			else if (volts === 2000000) story = 'Your company is in The Museum of Science and Industry!';
			else if (volts === 5000000) story = 'Your last electric factory has been closed. Take that old boss!';
			
			if (story) this.trigger('story', story);
		}
		
	});
	
	return new AppModel();
	
});