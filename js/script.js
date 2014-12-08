var Game = {
	// system's data var
	version: 1.01,
	// vars
	intervalVPS: 1000, // vps tick
	elasped: 0, // time user played in miliseconds

	volts: 0, // volts
	voltsTot: 0, // total volts
	voltsTotAll: 0, // total volts all time
	prestiege: 0, // self exclamatory
	_vps: 0, // vps (used for displaying vps)
	perClick: 0, // per clicks (used for upgrades)
	
	// stats
	clicked: 0,
	sessionStart: undefined,
	sessionStarted: false,
	gameStart: undefined,
	gameStarted: false,

	// DOM elements
	// buttons,...
	button: undefined,
	count: undefined,
	store: undefined,
	vpsDisplay: undefined,
	levelDisplay: undefined,
	expDisplay: undefined,
	levelNDisplay: undefined,
	toNextLevelDisplay: undefined,
	pbarDisplay: undefined,
	// options
	saveG: undefined,
	resetG: undefined,
	hresetG: undefined,
	importG: undefined,
	exportG: undefined,
	stats: undefined,

	// vps ticker incase if wanting to stop it
	handleVPS: undefined,

	// data
	buildings: [],
	upgrades: [],
	achievements: [],
	evoData: [],
	
	// helper objects
	Building: undefined,
	Level: undefined,
	calc: undefined,
	saveload: undefined,
	// functions
	init: function () {
		var self = this;
		this.calc = calc;
		this.saveload = saveload;
		this.Building = Building;
		
		this.evoData = evoD;
		this.Level = new Level(this.evoData);
		
		this.button = $('#bulb');
		this.count = $('#count');
		this.store = $('#lightbulb');
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
		
		this.button.click(function() {
			self._earn(1);
			self.Level.gainExp(1);
			self.clicked++;
		});
		
		for (var _building in buildingsD) {
			var newBuilding = this.Building(buildingsD[_building]).init();
			self.buildings.push(newBuilding);
		}
		
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
		
		this.handleVPS = window.setInterval(function() {
				this.handleVPS = self._tickVPS();
			}, this.intervalVPS);
				
		this._loadSaveFile();
		// date
		if (!this.sessionStarted) {
			this.sessionStart = new Date();
		} if (!this.gameStarted) {
			this.gameStart = new Date();
		}
		this._update();
	},
	
	_saveFile: function () {
		var saveFile = self.saveload.saveGame();
			window.localStorage.setItem("LBClicker.saveFile",saveFile)
		var alert = $("<div class='alert'></div>")
			.addClass(((saveFile === false) ? "alert-danger" : "alert-success") + " cAlert")
			.text((saveFile === false) ? "There's an error in the mainframe." : "Save file complete.")
			.fadeIn(1000).delay(5000).fadeOut(1000)
		$('body').append(alert);
	},
	
	_loadSaveFile: function () {
		if (localStorage["LBClicker.saveFile"]) var loadGame = this.saveload.loadGame(localStorage["LBClicker.saveFile"]);
		var alert = $("<div class='alert'></div>")
			.addClass(((loadGame === false) ? "alert-danger" : "alert-success") + " cAlert")
			.text((loadGame === false) ? "The computer is a moron." : "Load file complete.")
			.fadeIn(1000).delay(5000).fadeOut(1000)
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
			if (!isNaN(num)) return 0;
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
					className: "btn-danger",
				},
			}
		});
	},
	
	_update: function () { // updates the UI
		for (var b in this.buildings) {
			this.buildings[b].check();
			this.buildings[b].update();
		}
		this.count.text(this.beautify(parseInt(this.volts)));
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
	
	_tickVPS: function () {
		// vps
		var vps = this.calc.calcVPS(this.buildings);
		if (vps) this._earn(vps);
		this._vps = vps;
	},
	
	beautify: function (x) {
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	},
	toId: function (text) {
		return text.toString().toLowerCase().replace(/[^a-z0-9]+/g, '');
	}
};
$(document).ready(function() {
	Game.init();
});