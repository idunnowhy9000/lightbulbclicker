/*************************************************
* Lightbulb Clicker's save/load script file
* Controls save/load
*************************************************/
(function (window) {
	"use strict";
	window.Game.saveload = {
		loadGame: function (saveData) {
			var Game = window.Game,
				version = 0,
				decoded = window.atob(saveData),
				errors = [];
			decoded = decoded.split('!');
			version = parseFloat(decoded[0]);
			if (isNaN(version)) {
				errors.push("Your save file is invalid.");
			}
			if (version > Game.version) {
				errors.push("Your save file is from a future version.");
			} else if (version >= 1) {
				Game.volts = parseFloat(decoded[1]) || 0;
				Game.voltsTot = parseFloat(decoded[2]) || 0;
				Game.voltsTotAll = parseFloat(decoded[3]) || 0;
				Game.prestiege = parseFloat(decoded[4]) || 0;
				var buildings = decoded[5];
				for (var b in buildings) {
					var bId = buildings[b].split("=")[0];
					if (Game.buildings[bId]) {
						Game.buildings[bId].amount = buildings[b].split("=")[1] || 0;
					}
				}
				Game.sessionStart = new Date(decoded[7]);
				Game.sessionStarted = decoded[8] || false;
				Game.gameStart = new Date(decoded[9]);
				Game.gameStarted = decoded[10] || false;
				Game.clicked = parseFloat(decoded[11]) || 0;
				Game.factName = decoded[12] || "";
				Game.nameSettable = decoded[13] || false;
				var upgrades = decoded[14];
				for (var u in upgrades) {
					var uId = upgrades[u].split("=")[0];
					if (Game.upgrades[uId]) {
						Game.upgrades[uId].amount = upgrades[u].split("=")[1] || 0;
					}
				}
			} else {
				errors.push("Cannot read version >1.0 save files.");
			}
			if (errors.length > 0) {
				
			}
		},
		saveGame: function (){
			var saveData = [];
			saveData.push(Game.version);
			saveData.push(Game.volts);
			saveData.push(Game.voltsTot);
			saveData.push(Game.voltsTotAll);
			saveData.push(Game.prestiege);
			var buildings = [];
			for (var b in Game.buildings) {
				var bd = Game.buildings[b];
				buildings.push(bd.id + "=" + bd.amount);
			}
			saveData.push(buildings.join(","));
			// stats
			saveData.push(Game.sessionStart.getTime());
			saveData.push(Game.sessionStarted);
			saveData.push(Game.gameStart.getTime());
			saveData.push(Game.gameStarted);
			saveData.push(Game.clicked);
			saveData.push(Game.factName);
			saveData.push(Game.nameSettable);
			var upgrades = [];
			for (var u in Game.upgrades) {
				var up = Game.upgrades[u];
				upgrades.push(up.id + "=" + up.amount);
			}
			saveData.push(upgrades);
			saveData.push(levelHandler.level);
			saveData.push(levelHandler.exp);
			saveData.push(levelHandler.toNextLevel);
			saveData.push(levelHandler.levelTotalExp);
			saveData.push(levelHandler.levelN);
			// encode
			var save = saveData.join("!");
			save = window.btoa(save);
			return save;
		},
		convertSaveFile: function (n){
		},
	}
})(window);