define(["jquery", "underscore",
	"models/Achievement", "models/Building", "models/Level", "models/Calculator",
	"views/Achievement", "views/Building", "views/Level", "views/Page",
	"data/Achievement", "data/Building", "data/Upgrade"],
	function ($, _,
		AchievementModel, BuildingModel, LevelModel, Calculator,
		AchievementView, BuildingView, LevelView, PageView,
		AchievementData, BuildingData, UpgradeData) {
		
	var Game = function () {
		this.loaded = false;
		this.drawed = false;
		this.optionsOpened = false;
		
		// vars
		this.volts = 0; // volts
		this.voltsTot = 0; // total volts
		this.voltsTotAll = 0; // total volts all time
		this.prestiege = 0; // self exclamatory
		this._vps = 0; // cached vps
		this._expps = 0; // cached exp
		this._vpc = 0; // cached clicks
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
		this.weatherElapsed = undefined;
		this.date = undefined;
		this.elapsed = undefined;
		this.lastTick = undefined;
		
		// data
		this.buildings = undefined;
		this.upgrades = undefined;
		
		// models
		this.calculator = Calculator;
	};
	
	var GProto = Game.prototype;
	
	// constants
	GProto.VERSION = 1.21;
	GProto.VERSION_READ = "1.21 Jiggawatts";
	GProto.STORAGE_NAME = "LBClicker";
	
	// functions
	GProto.init = function () {
		var self = this;
		
		this.loaded = true;
		this.loaded = true;

		this.curDate = new Date();
		if (!this.sessionStarted) {
			this.sessionStart = new Date();
			this.sessionStarted = true;
		}
		if (!this.gameStarted) {
			this.gameStart = new Date();
			this.gameStarted = true;
		}
		
		//this.draw();
		
		this.date = Date.now();
		this.logicElasped = 0;
		this.autoSaveElapsed = 0;
		this.elapsed = Date.now();
		this.lastTick = Date.now();
		
		// buildings
		_.forEach(BuildingData, function (_b) {
			var building = new BuildingModel(_b);
			self.buildings[building.id] = building;
		});
		
		// upgrades
		_.forEach(UpgradeData, function (_u) {
			var newUpgrade = new UpgradeModel(_u);
			self.upgrades[newUpgrade.id] = newUpgrade;
		});
		
		//this.sortUpgrades();
		
		// achievements
		_.forEach(AchievementData, function (_a) {
			var newAchievement = new AchievementModel(_a);
			self.achievements[newAchievement.id] = newAchievement;
		});
		
		// weather
		
		// level
		/*
		this.Level.draw();
		this.Level.update();
		
		// default prefs
		this.prefs = {
			'shortNums': false,
			'paused': false,
			'autoSave': true
		};
		
		this.loadGame();
		
		// calculate
		this._calcVPS();
		this._calcVPC();

		this.loop();
		this.refresh();
		
		this.updateFactName(this.factName);
		if (this.backToMainAble) this.switchColumn(2);
		*/
	};
	
	return Game;
	
});