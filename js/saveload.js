/*************************************************
* Lightbulb Clicker's save/load script file
* Controls save/load
*************************************************/
(function (Game) {
    "use strict";
    Game.saveload = {
        loadGame: function (saveData) {
            var errors = [];
            
            try {
                var decoded = window.atob(saveData).split('!'),
                    version = parseFloat(decoded[0]);
                
                if (isNaN(version)) {
                    errors.push("Your save file is invalid.");
                }
                
                if (version > Game.version) {
                    errors.push("Your save file is from a future version.");
                } else if (version >= 1) {
                    var i;
                    
                    Game.volts = parseFloat(decoded[1]) || 0;
                    Game.voltsTot = parseFloat(decoded[2]) || 0;
                    Game.voltsTotAll = parseFloat(decoded[3]) || 0;
                    Game.prestiege = parseFloat(decoded[4]) || 0;
                    
                    // buildings
                    var buildings = decoded[5].split(","), b; i = 0;
                    for (b in Game.buildings) {
                        Game.buildings[b].amount = parseInt(buildings[i++]);
                    }
                    
                    Game.sessionStart = new Date(parseInt(decoded[6]));
                    Game.sessionStarted = decoded[7] || false;
                    
                    Game.gameStart = new Date(parseInt(decoded[8]));
                    Game.gameStarted = decoded[9] || false;
                    
                    Game.clicked = parseFloat(decoded[10])|0;
                    Game.factName = decoded[11] || "";
                    Game.nameSettable = decoded[12] || false;
                    
                    // upgrades
                    var upgrades = decoded[13], u; i = 0;
                    for (u in Game.upgrades) {
                        Game.upgrades[u].amount = (upgrades[i++] === '1' ? 1 : 0);
                    }
                    
                    Game.Level.level = parseFloat(decoded[14])|0;
                    Game.Level.exp = parseFloat(decoded[15])|0;
                    Game.Level.toNextLevel = parseFloat(decoded[16])|0;
                    Game.Level.levelTotalExp = parseFloat(decoded[17])|0;
                    Game.Level.levelN = parseFloat(decoded[18])|0;
                    
                    // achievements
                    var achievements = decoded[19], a; i = 0;
                    for (a in Game.achievements) {
                        Game.achievements[a].amount = (achievements[i++] === '1' ? 1 : 0);
                    }
                    
                } else {
                    errors.push("Cannot read version >1.0 save files.");
                }
                
            } catch (e) {
                errors.push(e);
            }
            return errors;
        },
        saveGame: function (){
            var saveData = [];
            saveData.push(Game.version);
            saveData.push(Game.volts);
            saveData.push(Game.voltsTot);
            saveData.push(Game.voltsTotAll);
            saveData.push(Game.prestiege);
            
            // buildings
            var buildings = [], b;
            for (b in Game.buildings) {
                buildings.push(Game.buildings[b].amount);
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
            
            // upgrades
            var upgrades = [], u;
            for (u in Game.upgrades) {
                upgrades.push(Game.upgrades[u].amount);
            }
            saveData.push(upgrades.join(","));
            
            saveData.push(Game.Level.level);
            saveData.push(Game.Level.exp);
            saveData.push(Game.Level.toNextLevel);
            saveData.push(Game.Level.levelTotalExp);
            saveData.push(Game.Level.levelN);
            
            // achievements
            var achievements = [], a;
            for (a in Game.achievements) {
                achievements.push(Game.achievements[a].amount);
            }
            saveData.push(achievements.join(","));
            
            // encode
            return window.btoa(saveData.join("!"));
        }
    };
})(window.Game || {});