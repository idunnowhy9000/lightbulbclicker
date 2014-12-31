/*************************************************
* Lightbulb Clicker's main script file
* Controls magic and madness (1.3b)
*************************************************/
(function (window) {
	"use strict";
	// load datas
	// tools
	window.loadTools();
	// the game itself
	var Game = function () {
		// system's data var
		this.version = 1.2;
		this.versionRead = "1.3b";
		this.lStorageName = "LBClicker";
		this.loaded = false;
		this.drawed = false;
		// vars
		this.volts = 0; // volts
		this.voltsTot = 0; // total volts
		this.voltsTotAll = 0; // total volts all time
		this.prestiege = 0; // self exclamatory
		this._vps = 0; // vps (used for displaying vps)
		this._expps = 0; // exp per second
		this.perClick = 0; // per clicks (used for upgrades)
		this.curDate = undefined; // launched date
		
		this.baseWeather = undefined;
		this.curWeather = undefined;
		
		// stats
		this.clicked = 0;
		this.sessionStart = undefined;
		this.sessionStarted = false;
		this.gameStart = undefined;
		this.gameStarted = false;
		this.factName = "";
		this.nameSettable = false;
		
		// timer
		this.logicElasped = undefined;
		this.date = undefined;
		this.elapsed = undefined;
		this.lastTick = undefined;
		this.fps = undefined;

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
		// options
		this.saveG = undefined;
		this.resetG = undefined;
		this.hresetG = undefined;
		this.importG = undefined;
		this.exportG = undefined;
		this.stats = undefined;

		// data
		this.buildingsD = [];
		this.upgradesD = [];
		this.achievementsD = [];
		this.weatherD = [];
		this.levelHandler = undefined;
		
		// loaded data
		this.buildings = [];
		this.upgrades = [];
		this.achievements = [];
		
		// helper objects
		this.Building = undefined;
		this.Upgrade = undefined;
		this.Level = undefined;
		this.WeatherHandler = undefined;
		this.calc = undefined;
		this.saveload = undefined;
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
			this.stats = l('#stats');
			this.factNameDisplay = l('#factNameDisplay');
			this.gameContainer = l('#gameContainer');
			
			this.date = Date.now();
			this.logicElasped = 0;
			this.elapsed = Date.now();
			this.lastTick = Date.now();
			this.fps = 60;
			
			// doms
			this.bulb.addEventListener("click", function () {
				self.bulbClick();
			});
			
			// buildings
			for (var _building in this.buildingsD) {
				var newBuilding = new this.Building(this.buildingsD[_building]);
				this.buildings[newBuilding.id] = newBuilding;
				this.buildings[newBuilding.id].draw();
			}
			
			// upgrades
			for (var _upgrade in this.upgradesD) {
				var newUpgrade = new this.Upgrade(this.upgradesD[_upgrade]);
				this.upgrades[newUpgrade.id] = newUpgrade;
				this.upgrades[newUpgrade.id].draw();
			}
			this.sortUpgrades();
			
			// weather
			
			// level
			this.levelHandler = new this.Level();
			this.levelHandler.draw();
			this.levelHandler.update();

			this.loop();
			this.refresh();
		}		

		// draw
		this.draw = function () {
			if (!this.drawed) {
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

				var lightbulbListTitle = document.createElement('p');
				lightbulbListTitle.setAttribute('id', 'lightbulbListTitle');
				lightbulbListTitle.setAttribute('class', 'large');
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

				var voltCounter = document.createElement('div');
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
				options.setAttribute('id', 'options');
				options.setAttribute('class', 'btn');
				options.appendChild(document.createTextNode('Options'));
				colMid.appendChild(options);

				// colRight
				colRight.setAttribute('id','col3');

				var upgradeListContainer = document.createElement('div');
				upgradeListContainer.setAttribute('id', 'upgradeListContainer');
				colRight.appendChild(upgradeListContainer);

				var upgradeListTitle = document.createElement('p');
				upgradeListTitle.setAttribute('id', 'upgradeListTitle');
				upgradeListTitle.setAttribute('class', 'large');
				upgradeListTitle.appendChild(document.createTextNode('Upgrades'));
				upgradeListContainer.appendChild(upgradeListTitle);

				var upgradeStore = document.createElement('div');
				upgradeStore.setAttribute('id', 'upgrade');
				upgradeListContainer.appendChild(upgradeStore);
				// drawed in Upgrade.draw

				// container
				container.appendChild(colLeft);
				container.appendChild(colMid);
				container.appendChild(colRight);
				this.drawed = true;
			}
			return this.drawed;
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
			this.count.childNodes[0].nodeValue = Tools.beautify(Math.floor(this.volts)) + " volt" + (Math.floor(this.volts) > 1 ? "s" : "");
			this.vpsDisplay.childNodes[0].nodeValue = Tools.beautify(this._vps) + " volt" + (this._vps > 1 ? "s" : "") + "/second";
		}
		
		this.backdrop = function () {
			var el = document.createElement("div");
			el.setAttribute('id', 'backdrop');
			
			document.body.appendChild(el);
		}
		this.unbackdrop = function () {
			Tools.removeElement(l("#backdrop"));
		}
		
		// events
		this.bulbClick = function () {
			this._earn(1);
			this.levelHandler.gainExp(1);
			this.clicked++;
		}
		
		this.saveGClick = function () {
		
		}
		
		this.loadGClick = function () {
		
		}
		
		this.saveGame = function () {
			if (window.localStorage) {
				var savefile = this.saveload.saveGame();
				localStorage.setItem(this.lStorageName, savefile);
			}
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
		}
		
		this.refresh = function () { // screen tick
			var self = this;
			window.requestAnimFrame(function () {
				self.refresh();
			});
			
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
		}
		
		this.loop = function () {
			var self = this;
			
			this.elapsed = ((Date.now() - this.lastTick) / 1000);
			this.logicElasped += this.elapsed;
			this.time = Date.now();
			
			while (this.elapsed > 0) {
				if (this.logicElasped >= 1) {
					this.logic();
					this.logicElasped = 0;
				}
				this.elapsed -= 1000 / this.fps;
			}
			
			this.lastTick = Date.now();
			setTimeout(function () {
				self.loop();
			}, 1000 / this.fps);
		}
		return this;
	}
	// load the game
	var g = new Game();
	window.Game = g;
	// dom load
	window.addEventListener('load', function(){
		window.Game.init();
	});
})(window);