var saveload = {
	/*loadGame: function (n){
		try {
			saveSplit = n.split("!");
			sVersion = parseFloat(saveSplit[0]);
			sVolt = parseFloat(saveSplit[1]);
			sVolttot = parseFloat(saveSplit[2]);
			sPrestiege = parseFloat(saveSplit[3]);
			sAmountBulb = saveSplit[4];
			sAmountUpgrade = saveSplit[5];
			// checks
			if (sVersion < version){
				// check compatibility
				if (sVersion <= 0.38 && sVersion > 0.20){
					convertSaveFile(n);return;
				} else if(sVersion < 0.20){
					alert("This version is not supported");
					return;
				}
			} else if (sVersion > version){
				
			}
			console.log('pass');
			// begin import
			volt = parseFloat(sVolt);
			console.log(volt);
			console.log(parseInt(sVolt));
			
			volttot = parseFloat(sVolttot);
			prestiege = sPrestiege;
			amountBulb = JSON.parse(sAmountBulb);
			amountUpgrade = JSON.parse(sAmountUpgrade);
			updateTable();
		} catch (e){
		}
	},*/
	loadGame: function (saveData) {
		var G = Game;
		try {
			saveSplit = saveData.split("!");
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
			clicekd = saveSplit[10];
			if (version < G.version){
				// check compatibility
				if (version >= 0.38) {
					return this.convertSaveFile(saveData);
				}
			}
			// begin import
			G.volts = parseFloat(volts);
			G.voltsTot = parseFloat(voltsTot);
			G.prestiege = parseFloat(prestiege);
			G.sessionStart = sessionStart;
			G.sessionStarted = sessionStarted;
			G.gameStart = gameStart;
			G.clicked = clicked;
			for (var b in G.buildings) {
				G.buildings[b].amount = buildings.split(',')[b];
			}
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
		saveData += G.sessionStart.toString() + "!";
		saveData += G.sessionStarted + "!";
		saveData += G.gameStart.toString() + "!";
		saveData += G.gameStarted + "!";
		saveData += G.clicked + "!";
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
			window.localStorage.removeItem("LBClicker.saveFile")
		}
		Game._update();
		return;
	}
}