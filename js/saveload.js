/*************************************************
* Lightbulb Clicker's save/load script file
* Controls save/load
*************************************************/
(function (Game) {
    "use strict";
    Game.saveload = {
        loadGame: function (saveData) {
            var Game = window.Game,
                version = 0,
                errors = [],
                decoded;
            
            try {
                decoded = window.atob(saveData).split('!');
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
                    Game.sessionStart = decoded[6];
                    Game.sessionStarted = decoded[7] || false;
                    Game.gameStart = decoded[8];
                    Game.gameStarted = decoded[9] || false;
                    Game.clicked = parseFloat(decoded[10]) || 0;
                    Game.factName = decoded[11] || "";
                    Game.nameSettable = decoded[12] || false;
                    var upgrades = decoded[13], u, uId;
                    for (u in upgrades) {
                        uId = upgrades[u].split("=")[0];
                        if (uId in Game.upgrades) {
                            Game.upgrades[uId].amount = upgrades[u].split("=")[1] || 0;
                        }
                    }
                    Game.Level.level = parseFloat(decoded[14]) || 0;
                    Game.Level.exp = parseFloat(decoded[15]) || 0;
                    Game.Level.toNextLevel = parseFloat(decoded[16]) || 0;
                    Game.Level.levelTotalExp = parseFloat(decoded[17]) || 0;
                    Game.Level.levelN = parseFloat(decoded[18]) || 0;
                    var achievements = decoded[19], a, ach;
                    for (a in achievements) {
                        ach = achievements[a].split("=")[0];
                        if (ach in Game.achievements) {
                            Game.achievements[ach].amount = achievements[a].split("=")[1] || 0;
                        }
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
            var buildings = [], b, bd;
            for (b in Game.buildings) {
                bd = Game.buildings[b];
                buildings.push(bd.id + "=" + bd.amount);
            }
            saveData.push(buildings.join(","));
            // stats
            saveData.push(Game.sessionStart);
            saveData.push(Game.sessionStarted);
            saveData.push(Game.gameStart);
            saveData.push(Game.gameStarted);
            saveData.push(Game.clicked);
            saveData.push(Game.factName);
            saveData.push(Game.nameSettable);
            // upgrades
            var upgrades = [], u, up;
            for (u in Game.upgrades) {
                up = Game.upgrades[u];
                upgrades.push(up.id + "=" + up.amount);
            }
            saveData.push(upgrades);
            saveData.push(Game.Level.level);
            saveData.push(Game.Level.exp);
            saveData.push(Game.Level.toNextLevel);
            saveData.push(Game.Level.levelTotalExp);
            saveData.push(Game.Level.levelN);
            // achievements
            var achievements = [], a, ach;
            for (a in Game.achievements) {
                ach = Game.achievements[a];
                achievements.push(ach.id + "=" + ach.amount);
            }
            saveData.push(achievements);
            // encode
            var save = saveData.join("!");
            save = window.btoa(save);
            return save;
        }
    };
})(window.Game || {});