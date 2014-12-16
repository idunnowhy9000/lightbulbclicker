var Game = {
	// system's data var
	version: 1.1,
	// vars
	volts: 0, // volts
	voltsTot: 0, // total volts
	voltsTotAll: 0, // total volts all time
	prestiege: 0, // self exclamatory
	_vps: 0, // vps (used for displaying vps)
	_expps: 0, // exp per second
	perClick: 0, // per clicks (used for upgrades)
	
	// stats
	clicked: 0,
	sessionStart: undefined,
	sessionStarted: false,
	gameStart: undefined,
	gameStarted: false,
	factName: "",
	nameSettable: false,
	
	// timer
	timer: undefined,
	fps: 30,
	ticks: 0,

	// DOM elements
	// buttons,...
	button: undefined,
	count: undefined,
	store: undefined,
	upgradeStore: undefined,
	vpsDisplay: undefined,
	levelDisplay: undefined,
	expDisplay: undefined,
	levelNDisplay: undefined,
	toNextLevelDisplay: undefined,
	pbarDisplay: undefined,
	factNameDisplay: undefined,
	// options
	saveG: undefined,
	resetG: undefined,
	hresetG: undefined,
	importG: undefined,
	exportG: undefined,
	stats: undefined,

	// data
	buildings: [],
	upgrades: [],
	achievements: [],
	evoData: [],
	
	// helper objects
	Building: undefined,
	Upgrade: undefined,
	Level: undefined,
	calc: undefined,
	saveload: undefined,
	// functions
	init: function () {
		var self = this;
		this.calc = calc;
		this.saveload = saveload;
		this.Building = Building;
		this.Upgrade = Upgrade;
		
		this.evoData = evoD;
		this.Level = new Level(this.evoData);
		
		this.button = $('#bulb');
		this.count = $('#count');
		this.store = $('#lightbulb');
		this.upgradeStore = $('#upgrade');
		this.vpsDisplay = $('#vps');
		this.levelDisplay = $('#level');
		this.lvlExpDisplay = $('#lvlExp');
		this.levelNDisplay = $('#levelN');
		this.toNextLevelDisplay = $('#toNextLevel');
		this.pbarDisplay = $('#pbar');
		this.saveG = $('#saveG');
		this.resetG = $('#resetG');
		this.hresetG = $('#hresetG');
		this.importG = $('#importG');
		this.exportG = $('#exportG');
		this.stats = $('#stats');
		this.factNameDisplay = $('#factNameDisplay');
		
		this.factNameDisplay.text(self.factName || "Your Factory").click(function () {
			if (self.nameSettable) {
				self._factName();
			}
		});
		
		this.button.click(function() {
			self._earn(1);
			self.Level.gainExp(1);
			self.clicked++;
		});
		
		this.saveG.click(function() {
			self._saveFile();
		});
		this.resetG.click(function() {
			self._reset();
		});
		this.hresetG.click(function() {
			self._hardReset();
		});
		this.importG.click(function() {
			self._import();
		});
		this.exportG.click(function() {
			self._export();
		});
		this.stats.click(function() {
			self._stats();
		});
		
		for (var _building in buildingsD) {
			var newBuilding = this.Building(buildingsD[_building]).init();
			this.buildings[newBuilding.id] = newBuilding;
		}
		
		for (var _upgrade in upgradesD) {
			var newUpgrade = this.Upgrade(upgradesD[_upgrade]).init();
			this.upgrades[newUpgrade] = newUpgrade;
		}
		
		this.timer = {elasped : 0, lastFrame: Date.now()};
		this._loop();
		// load
		this._loadSaveFile();
		// date
		if (!this.sessionStarted) {
			this.sessionStart = new Date();
		} if (!this.gameStarted) {
			this.gameStart = new Date();
		}
		this._update();
	},
	
	// dialogs
	_saveFile: function () {
		var saveFile = self.saveload.saveGame();
			window.localStorage.setItem("saveFile",saveFile)
		this._notify("Save file complete.");
	},
	
	_loadSaveFile: function () {
		if (localStorage["saveFile"]) var loadGame = this.saveload.loadGame(localStorage["saveFile"]);
		this._notify("Load file complete.");
	},
	
	_reset: function () {
		var self = this;
		bootbox.dialog({
			title: "Reset",
			message: "Are you sure you want to reset?",
			buttons: {
				success: {
					label: "Yes",
					className: "btn-success",
					callback: function() {
						self.saveload.reset();
						var alert = $("<div class='alert'></div>")
							.addClass("alert-success cAlert")
							.text("Resetted.")
							.fadeIn(1000).delay(5000).fadeOut(1000)
					}
				},
				danger: {
					label: "No",
					className: "btn-danger",
					callback: function() {return;}
				}
			}
		});
	},
	
	_hardReset: function () {
		var self = this;
		bootbox.dialog({
			title: "HARD Reset",
			message: "Are you sure you want to <b>HARD</b> reset?",
			buttons: {
				success: {
					label: "Yes",
					className: "btn-success",
					callback: function() {
						self.saveload.reset(true);
						self._update();
						var alert = $("<div class='alert'></div>")
							.addClass("alert-success cAlert")
							.text("Resetted.")
							.fadeIn(1000).delay(5000).fadeOut(1000)
					}
				},
				danger: {
					label: "No",
					className: "btn-danger",
					callback: function() {return;}
				}
			}
		});
	},
	
	_import: function () {
		var self = this;
		bootbox.dialog({
			title: "Import",
			message: "<p class='center'>Enter import data:<br>" +
					'<input type="text" name="import"></p>',
			buttons: {
				success: {
					label: "Import",
					className: "btn-success",
					callback: function() {
						//self.saveload.loadGame();
					}
				}
			}
		});
	},
	
	_export: function () {
		var self = this;
		bootbox.dialog({
			title: "Export",
			message: "<p class='center'>Here's your export data:<br>" +
					'<input type="text" name="export" value=' + self.saveload.saveGame() + '></p>',
			buttons: {
				success: {
					label: "OK",
					className: "btn-success",
				}
			}
		});
	},
	
	_stats: function () {
		var self = this;
		function getNumBulbs () {
			var num = 0;
			for (var i in this.buildings) {
				num += this.buildings.amount;
			}
			if (isNaN(num)) return 0;
			return num;
		}
		bootbox.dialog({
			title: "Stats",
			message: "Volts in bank: " + self.beautify(parseInt(self.volts)) + "<br>" +
					"Total volts (this session): " + self.beautify(parseInt(self.voltsTot)) + "<br>" +
					"Total volts (all time): " + self.beautify(parseInt(self.voltsTotAll)) + "<br>" +
					"Session Started: " + self.sessionStart + "<br>" +
					"Game Started: " + self.gameStart + "<br>" +
					"Bulbs created: " + getNumBulbs() + "<br>" +
					"Clicked " + self.beautify(self.clicked) + " times<br>" +
					 self.beautify(parseInt(self.voltsTot)) + " bulbs gained per second<br>" +
					 self.beautify(parseInt(self.voltsTot)) + " bulbs gained per click<br><br>" +
					"Version " + self.version + "<br>" +
					"<hr>" +
					"Achievements Earned<br>" +
					 // achievements here
					"<hr>" +
					"Upgrades<br>" +
					"", // upgrades here
			buttons: {
				success: {
					label: "Close",
					className: "btn-success",
				},
			}
		});
	},
	_factName: function () {
		var self = this;
		bootbox.dialog({
			title: "Name your factory",
			message: '<form id="factName">' +
					'<input id="factNamebox" name="factNamebox" type="text" placeholder="Name" value="' + Game.factName + '" class="form-control input-md">' +
					'</form>',
			buttons: {
				success: {
					label: "OK",
					className: "btn-success",
					callback: function () {
						var name = $('#factNamebox').val();
						self.factName = name;
						self.factNameDisplay.text(name);
					}
				},
				danger: {
					label: "Close",
					className: "btn-danger",
				},
			}
		});
	},
	
	// other
	_notify: function (type, message) {
		var typeClass = {0: 'alert-info', 1: 'alert-danger', 2: 'alert-success'};
		var alert = $("<div class='alert'></div>")
			.addClass(typeClass[type] + " cAlert")
			.text(type === 1 ? "There's an error in the mainframe." : message)
			.fadeIn(1000).delay(5000).fadeOut(1000, function () {this.remove()})
		$('#alertContainer').append(alert);
	},
	
	_update: function () { // updates the UI
		for (var b in this.buildings) {
			this.buildings[b].update();
		}
		for (var u in this.upgrades) {
			this.upgrades[u].update();
		}
		this.count.text(this.beautify(parseInt(this.volts)) + " volt" + (this.volts > 0 ? "s" : ""));
		this.vpsDisplay.text(this._vps.toFixed(2));
		this.Level.update();
	},
	
	_earn: function (i) {
		this.volts += i;
		this.voltsTot += i;
		this.voltsTotAll += i;
		this._update();
	},
	
	_remove: function (i) {
		this.volts -= i;
		this._update();
	},
	
	_calcVPS: function () {
		var vps = this.calc.calcVPS();
		this._vps = vps;
		this._update();
	},
	
	// loops
	Logic: function () {
		if (Game._vps) Game._earn(Game._vps);
	},
	_loop: function () {
		Game.timer.elasped = (Date.now() - Game.timer.lastFrame) / 1000;
		Game.ticks += Game.timer.elasped;
		if (Game.ticks >= 1) {
			Game.Logic();
			Game.ticks = 0;
		}
		Game.timer.lastFrame = Date.now();
		setTimeout(Game._loop, 1000 / Game.fps);
	},
	
	// tools
	beautify: function (x) {
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	},
	toId: function (text) {
		return text.toString().toLowerCase().replace(/[^a-z0-9]+/g, '');
	},
	choose: function (arr) {
		return arr[Math.floor(Math.random() * arr.length)];
	},
};
$(document).ready(function() {
	Game.init();
});