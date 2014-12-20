var saveload = {
	loadGame: function (saveData) {
		var G = Game;
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
			gameStart = saveSplit[8];
			gameStarted = saveSplit[9];
			clicked = saveSplit[10];
			if (version < G.version){
				// check compatibility
			}
			// begin import
			G.volts = parseFloat(volts);
			G.voltsTot = parseFloat(voltsTot);
			G.prestiege = parseFloat(prestiege);
			G.sessionStart = new Date(sessionStart);
			G.sessionStarted = sessionStarted;
			G.gameStart = new Date(gameStart);
			G.gameStarted = gameStarted;
			G.clicked = clicked;
			for (var b in G.buildings) {
				G.buildings[b].amount = buildings.split(',')[b];
			}
			/*for (var b in G.upgrades) {
				G.upgrades[b].amount = upgrades.split(',')[b];
			}*/
			// update
			Game._update();
			return true;
		} catch (e) {
			console.log("Error while loading: " + e)
			return false;
		}
	},
	saveGame: function (){
		var G = Game,
			saveData = "";
		saveData += G.version + "!";
		saveData += G.volts + "!";
		saveData += G.voltsTot + "!";
		saveData += G.voltsTotAll + "!";
		saveData += G.prestiege + "!";
		var buildings = "";
		for (var b in G.buildings) {
			var bd = G.buildings[b];
			buildings += bd.amount + ",";
		}
		saveData += buildings + "!";
		// stats
		saveData += G.sessionStart + "!";
		saveData += G.sessionStarted + "!";
		saveData += G.gameStart + "!";
		saveData += G.gameStarted + "!";
		saveData += G.clicked + "!";
		// encode
		saveData = window.btoa(saveData);
		return saveData;
	},
	convertSaveFile: function (n){
	},
	reset: function (hard) {
		Game.volts = 0;
		Game.voltsTot = 0;
		for (var b in Game.buildings) {
			Game.buildings[b].amount = 0;
			Game.buildings[b].displayed = false;
		}
		Game.sessionStart = new Date();
		Game.Level.level = 0;
		Game.Level.exp = 0;
		Game.Level.toNextLevel = 0;
		Game.Level.levelTotalExp = 0;
		Game.Level.levelCap = 100;
		// hard-specific
		if (hard === true) {
			Game.prestiege = 0;
			Game.voltsTotAll = 0;
			Game.clicked = 0;
			window.localStorage.removeItem("saveFile")
		}
		// soft
		if (!hard) {
			if (Game.upgrades['prestiegemode'].amount === 1) Game.prestiege += Game.calc.calcPrestiege();
		}
		Game._update();
		return;
	}
}