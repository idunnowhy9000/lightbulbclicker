// todo: fix
(function (window) {
	"use strict";
	window.Game.saveload = {
		loadGame: function (saveData) {
			try {
				saveDecode = window.atob(saveData);
				saveSplit = saveDecode.split("!");
				version = parseFloat(saveSplit[0]);
				volts = parseFloat(saveSplit[1]);
				voltsTot = parseFloat(saveSplit[2]);
				voltsTotAll = parseFloat(saveSplit[3]);
				prestiege = parseFloat(saveSplit[4]);
				buildings = saveSplit[5];
				sessionStart = saveSplit[6];
				sessionStarted = saveSplit[7];
				thisStart = saveSplit[8];
				thisStarted = saveSplit[9];
				clicked = saveSplit[10];
				if (version < this.version){
					// check compatibility
				}
				// begin import
				this.volts = parseFloat(volts);
				this.voltsTot = parseFloat(voltsTot);
				this.prestiege = parseFloat(prestiege);
				this.sessionStart = new Date(sessionStart);
				this.sessionStarted = sessionStarted;
				this.thisStart = new Date(thisStart);
				this.thisStarted = thisStarted;
				this.clicked = clicked;
				for (var b in this.buildings) {
					this.buildings[b].amount = buildings.split(',')[b];
				}
				/*for (var b in this.upgrades) {
					this.upgrades[b].amount = upgrades.split(',')[b];
				}*/
				// update
				this._update();
				return true;
			} catch (e) {
				console.log("Error while loading: " + e)
				return false;
			}
		},
		saveGame: function (){
			log(this);
			var saveData = "";
			saveData += this.version + "!";
			saveData += this.volts + "!";
			saveData += this.voltsTot + "!";
			saveData += this.voltsTotAll + "!";
			saveData += this.prestiege + "!";
			var buildings = "";
			for (var b in this.buildings) {
				var bd = this.buildings[b];
				buildings += bd.amount + ",";
			}
			saveData += buildings + "!";
			// stats
			saveData += this.sessionStart + "!";
			saveData += this.sessionStarted + "!";
			saveData += this.thisStart + "!";
			saveData += this.thisStarted + "!";
			saveData += this.clicked + "!";
			// encode
			saveData = window.btoa(saveData);
			return saveData;
		},
		convertSaveFile: function (n){
		},
		reset: function (hard) {
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
			if (hard === true) {
				this.prestiege = 0;
				this.voltsTotAll = 0;
				this.clicked = 0;
				window.localStorage.removeItem(this.lStorageName);
			}
			// soft
			if (!hard) {
				if (this.upgrades['prestiegemode'].amount === 1) this.prestiege += this.calc.calcPrestiege();
			}
			this._update();
			return;
		}
	}
})(window);