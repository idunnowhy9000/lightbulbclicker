/*************************************************
* Lightbulb Clicker's main script file
* Controls magic and madness (1.3b)
*************************************************/
(function (window) {
	"use strict";
	// load datas
	window.loadTools(); // tools
	// the game itself
	var Game = function () {
		// system's data var
		this.version = 1.2; // version
		this.versionRead = "1.3b"; // version readable
		this.lStorageName = "LBClicker"; // local storage var name
		this.loaded = false;
		this.drawed = false;
		this.optionsOpened = false;
		// vars
		this.volts = 0; // volts
		this.voltsTot = 0; // total volts
		this.voltsTotAll = 0; // total volts all time
		this.prestiege = 0; // self exclamatory
		this._vps = 0; // vps (used for displaying vps)
		this._expps = 0; // exp per second
		this._vpc = 0; // per clicks (used for upgrades)
		this.curDate = undefined; // launched date
		
		// stats
		this.clicked = 0;
		this.sessionStart = undefined;
		this.sessionStarted = false;
		this.gameStart = undefined;
		this.gameStarted = false;
		this.factName = "";
		this.nameSettable = false;
		this.starSysAble = false;
		this.timeTravelAble = false;
		this.spaceTravelAble = false;
		
		// timer
		this.logicElasped = undefined;
		this.autoSaveElapsed = undefined;
		this.date = undefined;
		this.elapsed = undefined;
		this.lastTick = undefined;

		// DOM elements
		// buttons,...
		this.bulb = undefined;
		this.count = undefined;
		this.store = undefined;
		this.upgradeStore = undefined;
		this.vpsDisplay = undefined;
		this.levelBarDisplay = undefined;
		this.levelContainer = undefined;
		this.levelDisplay = undefined;
		this.expDisplay = undefined;
		this.levelNDisplay = undefined;
		this.toNextLevelDisplay = undefined;
		this.pbarDisplay = undefined;
		this.factNameDisplay = undefined;
		this.gameContainer = undefined;
		this.shortNumsBtn = undefined;
		this.pausedBtn = undefined;
		this.autoSaveBtn = undefined;
		this.col1 = undefined;
		this.col2 = undefined;
		this.col3 = undefined;
		// options
		this.saveG = undefined;
		this.resetG = undefined;
		this.hresetG = undefined;
		this.importG = undefined;
		this.exportG = undefined;
		this.optionsBtn = undefined;
		this.factNameInput = undefined;
		this.factNameBtn = undefined;
		this.buildingsBtn = undefined;
		this.upgradesBtn = undefined;
		this.backToMain = undefined;
		this.achievementHolder = undefined;
		this.achievementImg = undefined;
		this.achievementName = undefined;
		
		// preferences
		this.prefs = {};

		// data
		this.buildingsD = [];
		this.upgradesD = [];
		this.achievementsD = [];
		
		// loaded data
		this.buildings = {};
		this.upgrades = {};
		this.achievements = {};
		this.levelHandler = undefined;
		
		// helper objects
		this.Building = undefined;
		this.Upgrade = undefined;
		this.Level = undefined;
		this.WeatherHandler = undefined;
		this.StarSystem = undefined;
		this.Achievement = undefined;
		this.calc = undefined;
		this.saveload = undefined;
		this.starSysHandler = undefined;
		
		// functions
		this.init = function () {
			this.loaded = true;
			
			this.curDate = new Date();
			if (!this.sessionStarted) {
				this.sessionStart = new Date();
				this.sessionStarted = true;
			} if (!this.gameStarted) {
				this.gameStart = new Date();
				this.gameStarted = true;
			}
			
			this.draw();
			
			var self = this;
			
			this.bulb = l('#bulb');
			this.count = l('#count');
			this.store = l('#lightbulb');
			this.upgradeStore = l('#upgrade');
			this.vpsDisplay = l('#vpsDisplay');
			this.levelBarDisplay = l('#levelBarContainer');
			this.levelContainer = l('#levelContainer');
			this.levelDisplay = l('#level');
			this.lvlExpDisplay = l('#lvlExp');
			this.levelNDisplay = l('#lvlN');
			this.toNextLevelDisplay = l('#toNextLevel');
			this.pbarDisplay = l('#pbar');
			this.saveG = l('#saveG');
			this.resetG = l('#resetG');
			this.hresetG = l('#hresetG');
			this.importG = l('#importG');
			this.exportG = l('#exportG');
			this.optionsBtn = l('#optionsBtn');
			this.factNameDisplay = l('#factNameDisplay');
			this.gameContainer = l('#gameContainer');
			this.col1 = l('#col1');
			this.col2 = l('#col2');
			this.col3 = l('#col3');
			this.buildingsBtn = l("#buildingsBtn");
			this.upgradesBtn = l("#upgradesBtn");
			this.backToMain = l("#backToMain");
			this.achievementHolder = l("#achievement");
			this.achievementImg = l("#achievementImg");
			this.achievementName = l("#achievementName");
			
			this.date = Date.now();
			this.logicElasped = 0;
			this.autoSaveElapsed = 0;
			this.elapsed = Date.now();
			this.lastTick = Date.now();
			
			// css hack for checking mobile phones
			this.backToMainAble = !!this.backToMain.style.display;
			
			// events
			this.bulb.addEventListener("click", function () {
				self.bulbClick();
			});
			this.saveG.addEventListener("click", function() {
				self.saveGClick();
			});
			this.optionsBtn.addEventListener("click", function() {
				self.openOptions();
			});
			this.resetG.addEventListener("click", function () {
				self.resetGClick();
			});
			this.hresetG.addEventListener("click", function () {
				self.hresetGClick();
			});
			this.factNameDisplay.addEventListener("click", function () {
				self.openFactoryName();
			});
			
			this.buildingsBtn.addEventListener("click", function () {
				self.switchColumn(1);
			});
			this.upgradesBtn.addEventListener("click", function () {
				self.switchColumn(3);
			});
			this.backToMain.addEventListener("click", function () {
				self.switchColumn(2);
			});
			
			// buildings
			this.buildingsD.forEach(function (_b) {
				var newBuilding = new self.Building(_b);
				self.buildings[newBuilding.id] = newBuilding;
				self.buildings[newBuilding.id].draw();
			});
			
			// upgrades
			this.upgradesD.forEach(function (_u) {
				var newUpgrade = new self.Upgrade(_u);
				self.upgrades[newUpgrade.id] = newUpgrade;
				self.upgrades[newUpgrade.id].draw();
			});
			
			this.sortUpgrades();
			
			// achievements
			this.achievementsD.forEach(function (_a) {
				var newAchievement = new self.Achievement(_a);
				self.achievements[newAchievement.id] = newAchievement;
			});
			
			// weather
			
			// level
			this.levelHandler = this.Level;
			this.levelHandler.draw();
			this.levelHandler.update();
			
			// default prefs
			this.prefs = {
				'shortNums': 0,
				'paused': 0,
				'autoSave': 1
			};
			
			this.loadGame();
			
			// calculate
			this._calcVPS();
			this._calcVPC();

			this.loop();
			this.refresh();
			
			this.updateFactName(this.factName);
			if (this.backToMainAble) this.switchColumn(2);
		}		

		// draw
		this.draw = function () {
			if (this.drawed) return;
				
			var container = l('#container'),
				colLeft = document.createElement('div'),
				colMid = document.createElement('div'),
				colRight = document.createElement('div');
			// draw
			// colLeft
			colLeft.setAttribute('id','col1');

			var lightbulbListContainer = document.createElement('div');
			lightbulbListContainer.setAttribute('id', 'lightbulbListContainer');
			colLeft.appendChild(lightbulbListContainer);

			var lightbulbListTitle = document.createElement('h1');
			lightbulbListTitle.setAttribute('id', 'lightbulbListTitle');
			lightbulbListTitle.appendChild(document.createTextNode('Lightbulbs'));
			lightbulbListContainer.appendChild(lightbulbListTitle);

			var store = document.createElement('div');
			store.setAttribute('id', 'lightbulb');
			lightbulbListContainer.appendChild(store);
			// drawed in Buildings.draw

			// colMid
			colMid.setAttribute('id','col2');

			var factNameDisplay = document.createElement('div');
			factNameDisplay.setAttribute('id', 'factNameDisplay');
			factNameDisplay.appendChild(document.createTextNode('Your Factory'));
			colMid.appendChild(factNameDisplay);

			var voltCounter = document.createElement('h1');
			voltCounter.setAttribute('id', 'count');
			voltCounter.appendChild(document.createTextNode('0 volt'));
			colMid.appendChild(voltCounter);

			var vpsDisplay = document.createElement('div');
			vpsDisplay.setAttribute('id', 'vpsDisplay');
			vpsDisplay.appendChild(document.createTextNode('0 volt/second'));
			colMid.appendChild(vpsDisplay);

			var bulbContainer = document.createElement('div');
			bulbContainer.setAttribute('id', 'bulbContainer');
			colMid.appendChild(bulbContainer);

			var bulb = document.createElement('div');
			bulb.setAttribute('id', 'bulb');
			colMid.appendChild(bulb);

			var progress = document.createElement('div');
			progress.setAttribute('id', 'pbar');
			colMid.appendChild(progress);

			var levelContainer = document.createElement('div');
			levelContainer.setAttribute('id', 'levelContainer');
			colMid.appendChild(levelContainer);

			var levelBarContainer = document.createElement('div');
			levelBarContainer.setAttribute('id', 'levelBarContainer');
			colMid.appendChild(levelBarContainer);

			var options = document.createElement('div');
			options.classList.add('options', 'menu');
			colMid.appendChild(options);

			var saveGameBtn = document.createElement('div');
			saveGameBtn.classList.add('btn');
			saveGameBtn.setAttribute('id', 'saveG');
			saveGameBtn.appendChild(document.createTextNode('Save Game'));
			options.appendChild(saveGameBtn);

			var resetGameBtn = document.createElement('div');
			resetGameBtn.classList.add('btn');
			resetGameBtn.setAttribute('id', 'resetG');
			resetGameBtn.appendChild(document.createTextNode('Reset Game'));
			options.appendChild(resetGameBtn);

			var hResetGameBtn = document.createElement('div');
			hResetGameBtn.classList.add('btn');
			hResetGameBtn.setAttribute('id', 'hresetG');
			hResetGameBtn.appendChild(document.createTextNode('Hard Reset Game'));
			options.appendChild(hResetGameBtn);

			options.appendChild(document.createElement('br'));

			var importGameBtn = document.createElement('div');
			importGameBtn.classList.add('btn');
			importGameBtn.setAttribute('id', 'importG');
			importGameBtn.appendChild(document.createTextNode('Import Game'));
			options.appendChild(importGameBtn);

			var exportGameBtn = document.createElement('div');
			exportGameBtn.classList.add('btn');
			exportGameBtn.setAttribute('id', 'exportG');
			exportGameBtn.appendChild(document.createTextNode('Export Game'));
			options.appendChild(exportGameBtn);

			options.appendChild(document.createElement('br'));

			var optionsBtn = document.createElement('div');
			optionsBtn.classList.add('btn');
			optionsBtn.setAttribute('id', 'optionsBtn');
			optionsBtn.appendChild(document.createTextNode('Options'));
			options.appendChild(optionsBtn);

			var buildingsBtn = document.createElement('div');
			buildingsBtn.classList.add('btn');
			buildingsBtn.setAttribute('id', 'buildingsBtn');
			buildingsBtn.appendChild(document.createTextNode('Buildings'));
			options.appendChild(buildingsBtn);

			var upgradesBtn = document.createElement('div');
			upgradesBtn.classList.add('btn');
			upgradesBtn.setAttribute('id', 'upgradesBtn');
			upgradesBtn.appendChild(document.createTextNode('Upgrades'));
			options.appendChild(upgradesBtn);

			// colRight
			colRight.setAttribute('id','col3');

			var upgradeListContainer = document.createElement('div');
			upgradeListContainer.setAttribute('id', 'upgradeListContainer');
			colRight.appendChild(upgradeListContainer);

			var upgradeListTitle = document.createElement('h1');
			upgradeListTitle.setAttribute('id', 'upgradeListTitle');
			upgradeListTitle.appendChild(document.createTextNode('Upgrades'));
			upgradeListContainer.appendChild(upgradeListTitle);

			var upgradeStore = document.createElement('div');
			upgradeStore.setAttribute('id', 'upgrade');
			upgradeListContainer.appendChild(upgradeStore);
			// drawed in Upgrade.draw

			// container
			var backToMain = document.createElement('div');
			backToMain.setAttribute('id', 'backToMain');
			backToMain.appendChild(document.createTextNode('Back To Main'));
			container.appendChild(backToMain);
			
			container.appendChild(colLeft);
			container.appendChild(colMid);
			container.appendChild(colRight);
			
			// achievements
			var achievementHolder = document.createElement('div');
			achievementHolder.setAttribute('id', 'achievement');
			achievementHolder.style.display = 'none';
			
			var achievementImg = document.createElement('div');
			achievementImg.setAttribute('id', 'achievementImg');
			achievementHolder.appendChild(achievementImg);
			
			var achievementInfo = document.createElement('div');
			achievementInfo.setAttribute('id', 'achievementInfo');
			achievementHolder.appendChild(achievementInfo);
			
			var achievementNote = document.createElement('div');
			achievementNote.setAttribute('id', 'achievementNote');
			achievementNote.appendChild(document.createTextNode("Achievement Earned!"));
			achievementInfo.appendChild(achievementNote);
			
			var achievementName = document.createElement('div');
			achievementName.setAttribute('id', 'achievementName');
			achievementInfo.appendChild(achievementName);
			
			container.appendChild(achievementHolder);
			
			this.drawed = true;
		}
		this.sortUpgrades = function () {
			var self = this,
				sortedUpgrades = self.upgradeStore,
				upgrades = sortedUpgrades.childNodes,
				upgradesArr = [];
			for (var i in upgrades) {
				if (upgrades[i].nodeType === 1) { // get rid of the whitespace text nodes
					upgradesArr.push(upgrades[i]);
				}
			}
			upgradesArr.sort(function (a, b) {
				var upgradeIdA = a.getAttribute("id").split('-')[1],
					upgradeIdB = b.getAttribute("id").split('-')[1];
				if (!self.upgrades[upgradeIdA] || !self.upgrades[upgradeIdB]) return 0;
				var upgradeA = self.upgrades[upgradeIdA],
					upgradeB = self.upgrades[upgradeIdB];
				if (upgradeA.cost > upgradeB.cost) return 1;
				else if (upgradeA.cost < upgradeB.cost) return -1;
				return 0;
			});
		}
		this.refreshCount = function () {
			if (this.prefs.shortNums === 0) {
				this.count.textContent = Tools.beautify(Math.floor(this.volts)) + " volt" + (Math.floor(this.volts) > 1 ? "s" : "");
				this.vpsDisplay.textContent = Tools.beautify(this._vps.toFixed(2)) + " volt" + (this._vps > 1 ? "s" : "") + "/second";
			} else {
				this.count.textContent = Tools.metricSuffix(Math.floor(this.volts));
				this.vpsDisplay.textContent = Tools.metricSuffix(this._vps.toFixed(2)) + "/second";
			}
		}
		this.refreshTitle = function () {
			var count, name = "Lightbulb Inc";
			count = this.prefs.shortNums ? Tools.metricSuffix(this.volts) : Tools.beautify(Math.floor(this.volts)) + " volt" + (Math.floor(this.volts) > 1 ? "s" : "");
			document.title = count + " - " + name;
		}
		
		this.openOptions = function () {
			var self = this;
			
			var optionsHolder = document.createElement('div');
			optionsHolder.classList.add('options');
			
			var optionsTitle = document.createElement('h1');
			optionsTitle.appendChild(document.createTextNode("Options"));
			optionsHolder.appendChild(optionsTitle);
			
			var shortNumsBtn = document.createElement('span');
			shortNumsBtn.classList.add('btn');
			shortNumsBtn.setAttribute('id', 'shortNumsBtn');
			shortNumsBtn.appendChild(document.createTextNode("Enable Short Numbers"));
			optionsHolder.appendChild(shortNumsBtn);
			
			var pausedBtn = document.createElement('span');
			pausedBtn.classList.add('btn');
			pausedBtn.setAttribute('id', 'pausedBtn');
			pausedBtn.appendChild(document.createTextNode("Pause Game"));
			optionsHolder.appendChild(pausedBtn);
			
			var autoSaveBtn = document.createElement('span');
			autoSaveBtn.classList.add('btn');
			autoSaveBtn.setAttribute('id', 'autoSaveBtn');
			autoSaveBtn.appendChild(document.createTextNode("Enable Autosave"));
			optionsHolder.appendChild(autoSaveBtn);
			
			// statistics
			
			var statisticsTitle = document.createElement('h1');
			statisticsTitle.appendChild(document.createTextNode("Statistics"));
			optionsHolder.appendChild(statisticsTitle);
			
			optionsHolder.appendChild(document.createTextNode('Version ' + this.versionRead));
			
			optionsHolder.appendChild(document.createElement('br'));
			
			optionsHolder.appendChild(document.createTextNode("Volts in bank: "));
			optionsHolder.appendChild(document.createTextNode(Tools.beautify(Math.floor(this.volts))));
			
			optionsHolder.appendChild(document.createElement('br'));
			
			optionsHolder.appendChild(document.createTextNode("Total volts (this session): "));
			optionsHolder.appendChild(document.createTextNode(Tools.beautify(Math.floor(this.voltsTot))));
			
			optionsHolder.appendChild(document.createElement('br'));
			
			optionsHolder.appendChild(document.createTextNode("Total volts (all time): "));
			optionsHolder.appendChild(document.createTextNode(Tools.beautify(Math.floor(this.voltsTotAll))));
			
			optionsHolder.appendChild(document.createElement('br'));
			
			optionsHolder.appendChild(document.createTextNode("Session Started: "));
			optionsHolder.appendChild(document.createTextNode(this.sessionStart));
			
			optionsHolder.appendChild(document.createElement('br'));
			
			optionsHolder.appendChild(document.createTextNode("Game Started: "));
			optionsHolder.appendChild(document.createTextNode(this.gameStart));
			
			optionsHolder.appendChild(document.createElement('br'));
			
			optionsHolder.appendChild(document.createTextNode("Bulbs created: "));
			optionsHolder.appendChild(document.createTextNode(this.calc.buildingsCreated()));
			
			optionsHolder.appendChild(document.createElement('br'));
			
			optionsHolder.appendChild(document.createTextNode("Clicked "));
			optionsHolder.appendChild(document.createTextNode(Tools.beautify(this.clicked)));
			optionsHolder.appendChild(document.createTextNode(" times"));
			
			optionsHolder.appendChild(document.createElement('br'));
			
			optionsHolder.appendChild(document.createTextNode(Tools.beautify(this._vps.toFixed(2))));
			optionsHolder.appendChild(document.createTextNode("  bulbs gained per second"));
			
			optionsHolder.appendChild(document.createElement('hr'));
			
			var upgradesTitle = document.createElement('h1');
			upgradesTitle.appendChild(document.createTextNode("Upgrades"));
			optionsHolder.appendChild(upgradesTitle);
			
			var upgradesHolder = document.createElement('div');
			upgradesHolder.setAttribute('id', 'upgradesHolder');
			optionsHolder.appendChild(upgradesHolder);
			
			for (var i in this.upgrades) {
				if (!this.upgrades[i].amount) continue;
				upgradesHolder.appendChild(this.upgrades[i].draw(1));
			}
			
			var achievementTitle = document.createElement('h1');
			achievementTitle.appendChild(document.createTextNode("Achievements"));
			optionsHolder.appendChild(achievementTitle);
			
			var achievementHolder = document.createElement('div');
			optionsHolder.appendChild(achievementHolder);
			
			for (var i in this.achievements) {
				if (!this.achievements[i].amount) continue;
				achievementHolder.appendChild(this.achievements[i].drawBox());
			}
			
			// events
			Modal.open({
				content: optionsHolder,
				closeCallback: function () {
					self.optionsOpened = false;
				}
			});
			
			this.shortNumsBtn = l('#shortNumsBtn');
			this.pausedBtn = l('#pausedBtn');
			this.autoSaveBtn = l('#autoSaveBtn');
			
			this.shortNumsBtn.addEventListener("click", function () {
				self.togglePrefs("shortNums");
			});
			
			this.pausedBtn.addEventListener("click", function () {
				self.togglePrefs("paused");
			});
			
			this.autoSaveBtn.addEventListener("click", function () {
				self.togglePrefs("autoSave");
			});
			
			this.optionsOpened = true;
		}
		
		this.updateOptions = function () {
			if (!this.optionsOpened) return;
			this.shortNumsBtn.textContent = this.prefs.shortNums ? "Disable Short Numbers" : "Enable Short Numbers";
			this.pausedBtn.textContent = this.prefs.paused ? "Resume Game" : "Pause Game";
			this.autoSaveBtn.textContent = this.prefs.autoSave ? "Disable Autosave" : "Enable Autosave";
		}
		
		this.openFactoryName = function () {
			var self = this;
			var factoryNameHolder = document.createElement('div');
			factoryNameHolder.setAttribute('id', 'factoryNameHolder');
			factoryNameHolder.classList.add('inputHolder');
			
			var factoryNameTitle = document.createElement('h1');
			factoryNameTitle.appendChild(document.createTextNode('Factory Name'));
			factoryNameHolder.appendChild(factoryNameTitle);
			
			var factoryNameInput = document.createElement('input');
			factoryNameInput.setAttribute('type', 'text');
			factoryNameInput.setAttribute('value', this.factName);
			factoryNameInput.setAttribute('placeholder', 'Input Name Here...');
			factoryNameInput.setAttribute('id', 'factoryNameInput');
			factoryNameHolder.appendChild(factoryNameInput);
			
			var btnHolder = document.createElement('div');
			btnHolder.classList.add('btnHolder');
			factoryNameHolder.appendChild(btnHolder);
			
			var setNameBtn = document.createElement('div');
			setNameBtn.classList.add('btn', 'inline', 'right');
			setNameBtn.appendChild(document.createTextNode("OK"));
			btnHolder.appendChild(setNameBtn);
			
			// events
			this.factNameInput = factoryNameInput;
			this.factNameBtn = setNameBtn;
			this.factNameBtn.addEventListener("click", function () {
				if (self.factNameInput.value) self.updateFactName(self.factNameInput.value);
				Modal.close();
			});
			
			Modal.open({
				content: factoryNameHolder
			});
		}
		
		// mobile helper
		this.switchColumn = function (col) {
			switch (col) {
				case 1:
					this.col1.style.display = "block";
					this.col2.style.display = "none";
					this.col3.style.display = "none";
					this.backToMain.style.display = "block";
				break;
				case 2:
					this.col1.style.display = "none";
					this.col2.style.display = "block";
					this.col3.style.display = "none";
					this.backToMain.style.display = "none";
				break;
				case 3:
					this.col1.style.display = "none";
					this.col2.style.display = "none";
					this.col3.style.display = "block";
					this.backToMain.style.display = "block";
				break;
			}
		}
		
		// events
		this.bulbClick = function () {
			this._earn(1);
			this.levelHandler.gainExp(1);
			this.clicked++;
		}
		this.statsClick = function () {
			
		}
		this.saveGClick = function () {
			this.saveGame();
		}
		this.togglePrefs = function (pref) {
			if (this.prefs[pref] === 0) this.prefs[pref] = 1;
			else this.prefs[pref] = 0;
		}
		this.resetGClick = function () {
			this.reset();
		}
		this.hresetGClick = function () {
			this.reset(1);
		}
		this.saveGame = function () {
			if (localStorage) {
				var savefile = this.saveload.saveGame();
				localStorage.setItem(this.lStorageName, savefile);
			}
		}
		this.loadGame = function () {
			if (localStorage && localStorage[this.lStorageName]) {
				var load = this.saveload.loadGame(localStorage.getItem(this.lStorageName));
				if (typeof load === 'array' && load.length > 0) {
					Modal.open({
						content: array.join("\n")
					});
				};
			}
		}
		this.reset = function (hard) {
			this.volts = 0;
			this.voltsTot = 0;
			for (var b in this.buildings) {
				this.buildings[b].amount = 0;
				this.buildings[b].displayed = false;
			}
			this.sessionStart = new Date();
			this.Level.level = 0;
			this.Level.exp = 0;
			this.Level.toNextLevel = 0;
			this.Level.levelTotalExp = 0;
			this.Level.levelCap = 100;
			// hard-specific
			if (hard) {
				this.factName = "";
				this.gameStart = new Date();
				this.prestiege = 0;
				this.voltsTotAll = 0;
				this.clicked = 0;
				localStorage.removeItem(this.lStorageName);
			}
			// soft
			if (!hard) {
				if (this.upgrades['prestiegemode'].amount === 1) this.prestiege += this.calc.calcPrestiege();
			}
			this.refresh();
			return;
		}
		
		this._earn = function (i) {
			this.volts += i;
			this.voltsTot += i;
			this.voltsTotAll += i;
		}
		this._remove = function (i) {
			this.volts -= i;
		}
		this._calcVPS = function () {
			var vps = this.calc.calcVPS();
			this._vps = vps;
			return vps;
		}
		this._calcVPC = function () {
			var vpc = this.calc.calcVPC();
			this._vpc = vpc;
			return vpc;
		}
		this.updateFactName = function (str) {
			this.factName = str;
			this.factNameDisplay.textContent = str || "Your Factory";
		}
		this.earnAchievement = function (id) {
			if (typeof this.achievements[id] === 'undefined') return;
			if (!this.achievements[id].earn()) return;
			this.statusAchievement(id);
		}
		this.statusAchievement = function (id) {
			if (typeof this.achievements[id] === 'undefined') return;
			
			var self = this,
			achievement = this.achievements[id];
			
			this.achievementImg.style.backgroundImage = ('url: ("' + achievement.name + '")');
			this.achievementName.textContent = achievement.name;
			
			this.achievementHolder.style.display = "";
			Tools.animateCSS(this.achievementHolder, "fadeIn");
			setTimeout(function () {
				Tools.animateCSS(self.achievementHolder, "fadeOut", function (el) {
					el.style.display = "none";
				});
			}, 2000);
		}
		this.refresh = function () { // screen tick
			var self = this;
			
			window.requestAnimationFrame(function () {
				self.refresh();
			});
			
			// options
			// (has to go first to control "Resume/Pause Game" option)
			this.updateOptions();
			
			if (this.prefs.paused) return;
			
			this.refreshCount();
			
			// buildings
			for (var _building in this.buildings) {
				this.buildings[_building].refresh();
			}
			// upgrades
			for (var _upgrade in this.upgrades) {
				this.upgrades[_upgrade].refresh();
			}
			// level
			this.levelHandler.update();
		}
		this.logic = function () { // logic tick
			if (this._vps) this._earn(this._vps);
			
			if (this.volts > 0) this.earnAchievement("firsttimer");
			if (this.volts > 100) this.earnAchievement("100");
			if (this.volts > 1000) this.earnAchievement("1000");
			if (this.volts > 1000000) this.earnAchievement("1000000");
			if (this.volts > 10000000) this.earnAchievement("10000000");
		}
		this.loop = function () {
			if (this.prefs.paused) return;
			
			this.elapsed = ((Date.now() - this.lastTick) / 1000);
			
			this.logicElasped++;
			this.autoSaveElapsed++;
					
			if (this.logicElasped >= 1) {
				this.logic();
				this.logicElasped = 0;
			}
			
			this.refreshTitle();
			
			if (this.prefs.autoSave && this.autoSaveElapsed >= 300) {
				this.saveGame();
				this.autoSaveElapsed = 0;
			}
			
			this.lastTick = Date.now();
			setTimeout(Game.loop, 1000);
		}
		
		return this;
	}
	// load the game
	var g = new Game();
	window.Game = g;
	// dom load
	window.addEventListener('DOMContentLoaded', function(){
		window.Game.init();
	});
})(window);