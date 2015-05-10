/*************************************************
* Lightbulb Clicker's main script file
* Controls magic and madness (1.3b)
*************************************************/
(function (window) {
    "use strict";
    
    // load datas
    window.loadTools(); // tools
    // the game itself
    window.Game = (function () {
        var Game = {};
        
        // system's data var
        Game.version = 1.21; // version
        Game.versionRead = "1.3b"; // version readable
        Game.lStorageName = "LBClicker"; // local storage var name
        Game.loaded = false;
        Game.drawed = false;
        Game.optionsOpened = false;
        // vars
        Game.volts = 0; // volts
        Game.voltsTot = 0; // total volts
        Game.voltsTotAll = 0; // total volts all time
        Game.prestiege = 0; // self exclamatory
        Game._vps = 0; // vps (used for displaying vps)
        Game._expps = 0; // exp per second
        Game._vpc = 0; // per clicks (used for upgrades)
        Game.curDate = undefined; // launched date
        
        // stats
        Game.clicked = 0;
        Game.sessionStart = undefined;
        Game.sessionStarted = false;
        Game.gameStart = undefined;
        Game.gameStarted = false;
        Game.factName = "";
        Game.nameSettable = false;
        Game.starSysAble = false;
        Game.timeTravelAble = false;
        Game.spaceTravelAble = false;
        
        // timer
        Game.logicElasped = undefined;
        Game.autoSaveElapsed = undefined;
        Game.weatherElapsed = undefined;
        Game.date = undefined;
        Game.elapsed = undefined;
        Game.lastTick = undefined;

        // DOM elements
        // buttons,...
        Game.bulb = undefined;
        Game.count = undefined;
        Game.store = undefined;
        Game.upgradeStore = undefined;
        Game.vpsDisplay = undefined;
        Game.levelBarDisplay = undefined;
        Game.levelContainer = undefined;
        Game.levelDisplay = undefined;
        Game.expDisplay = undefined;
        Game.levelNDisplay = undefined;
        Game.toNextLevelDisplay = undefined;
        Game.pbarDisplay = undefined;
        Game.factNameDisplay = undefined;
        Game.gameContainer = undefined;
        Game.shortNumsBtn = undefined;
        Game.pausedBtn = undefined;
        Game.autoSaveBtn = undefined;
        Game.col1 = undefined;
        Game.col2 = undefined;
        Game.col3 = undefined;
        // options
        Game.saveG = undefined;
        Game.resetG = undefined;
        Game.hresetG = undefined;
        Game.importG = undefined;
        Game.exportG = undefined;
        Game.optionsBtn = undefined;
        Game.factNameInput = undefined;
        Game.factNameBtn = undefined;
        Game.buildingsBtn = undefined;
        Game.upgradesBtn = undefined;
        Game.backToMain = undefined;
        Game.achievementHolder = undefined;
        Game.achievementImg = undefined;
        Game.achievementName = undefined;
        Game.timeTravelBtn = undefined;
        
        // preferences
        Game.prefs = {};

        // data
        Game.buildingsD = [];
        Game.upgradesD = [];
        Game.achievementsD = [];
        
        // loaded data
        Game.buildings = {};
        Game.upgrades = {};
        Game.achievements = {};
        Game.Level = {};
        
        // helper objects
        Game.Building = undefined;
        Game.Upgrade = undefined;
        Game.Level = undefined;
        Game.WeatherHandler = undefined;
        Game.StarSystem = undefined;
        Game.Achievement = undefined;
        Game.calc = undefined;
        Game.saveload = undefined;
        Game.starSysHandler = undefined;
        
        // functions
        Game.init = function () {
            Game.loaded = true;
            
            Game.curDate = new Date();
            if (!Game.sessionStarted) {
                Game.sessionStart = new Date();
                Game.sessionStarted = true;
            } if (!Game.gameStarted) {
                Game.gameStart = new Date();
                Game.gameStarted = true;
            }
            
            Game.draw();
            
            var self = Game;
            
            Game.bulb = l('#bulb');
            Game.count = l('#count');
            Game.store = l('#lightbulb');
            Game.upgradeStore = l('#upgrade');
            Game.vpsDisplay = l('#vpsDisplay');
            Game.levelBarDisplay = l('#levelBarContainer');
            Game.levelContainer = l('#levelContainer');
            Game.levelDisplay = l('#level');
            Game.lvlExpDisplay = l('#lvlExp');
            Game.levelNDisplay = l('#lvlN');
            Game.toNextLevelDisplay = l('#toNextLevel');
            Game.pbarDisplay = l('#pbar');
            Game.saveG = l('#saveG');
            Game.resetG = l('#resetG');
            Game.hresetG = l('#hresetG');
            Game.importG = l('#importG');
            Game.exportG = l('#exportG');
            Game.optionsBtn = l('#optionsBtn');
            Game.factNameDisplay = l('#factNameDisplay');
            Game.gameContainer = l('#gameContainer');
            Game.col1 = l('#col1');
            Game.col2 = l('#col2');
            Game.col3 = l('#col3');
            Game.buildingsBtn = l("#buildingsBtn");
            Game.upgradesBtn = l("#upgradesBtn");
            Game.backToMain = l("#backToMain");
            Game.achievementHolder = l("#achievement");
            Game.achievementImg = l("#achievementImg");
            Game.achievementName = l("#achievementName");
            
            Game.date = Date.now();
            Game.logicElasped = 0;
            Game.autoSaveElapsed = 0;
            Game.elapsed = Date.now();
            Game.lastTick = Date.now();
            
            // css hack for checking mobile phones
            Game.backToMainAble = !!Game.backToMain.style.display;
            
            // events
            Game.bulb.addEventListener("click", function () {
                self.bulbClick();
            });
            Game.saveG.addEventListener("click", function() {
                self.saveGClick();
            });
            Game.optionsBtn.addEventListener("click", function() {
                self.openOptions();
            });
            Game.resetG.addEventListener("click", function () {
                self.resetGClick();
            });
            Game.hresetG.addEventListener("click", function () {
                self.hresetGClick();
            });
            Game.factNameDisplay.addEventListener("click", function () {
                self.openFactoryName();
            });
            
            Game.buildingsBtn.addEventListener("click", function () {
                self.switchColumn(1);
            });
            Game.upgradesBtn.addEventListener("click", function () {
                self.switchColumn(3);
            });
            Game.backToMain.addEventListener("click", function () {
                self.switchColumn(2);
            });
            
            // buildings
            Game.buildingsD.forEach(function (_b) {
                var newBuilding = new self.Building(_b);
                self.buildings[newBuilding.id] = newBuilding;
                self.buildings[newBuilding.id].draw();
            });
            
            // upgrades
            Game.upgradesD.forEach(function (_u) {
                var newUpgrade = new self.Upgrade(_u);
                self.upgrades[newUpgrade.id] = newUpgrade;
                self.upgrades[newUpgrade.id].draw();
            });
            
            Game.sortUpgrades();
            
            // achievements
            Game.achievementsD.forEach(function (_a) {
                var newAchievement = new self.Achievement(_a);
                self.achievements[newAchievement.id] = newAchievement;
            });
            
            // weather
            
            // level
            Game.Level.draw();
            Game.Level.update();
            
            // default prefs
            Game.prefs = {
                'shortNums': 0,
                'paused': 0,
                'autoSave': 1
            };
            
            Game.loadGame();
            
            // calculate
            Game._calcVPS();
            Game._calcVPC();

            Game.loop();
            Game.refresh();
            
            Game.updateFactName(Game.factName);
            if (Game.backToMainAble) Game.switchColumn(2);
        };

        // draw
        Game.draw = function () {
            if (Game.drawed) return;
                
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

            var lightbulbListTitle = document.createElement('h1');
            lightbulbListTitle.setAttribute('id', 'lightbulbListTitle');
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

            var voltCounter = document.createElement('h1');
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
            options.classList.add('options', 'menu');
            colMid.appendChild(options);

            var saveGameBtn = document.createElement('div');
            saveGameBtn.classList.add('btn');
            saveGameBtn.setAttribute('id', 'saveG');
            saveGameBtn.appendChild(document.createTextNode('Save Game'));
            options.appendChild(saveGameBtn);

            var resetGameBtn = document.createElement('div');
            resetGameBtn.classList.add('btn');
            resetGameBtn.setAttribute('id', 'resetG');
            resetGameBtn.appendChild(document.createTextNode('Reset Game'));
            options.appendChild(resetGameBtn);

            var hResetGameBtn = document.createElement('div');
            hResetGameBtn.classList.add('btn');
            hResetGameBtn.setAttribute('id', 'hresetG');
            hResetGameBtn.appendChild(document.createTextNode('Hard Reset Game'));
            options.appendChild(hResetGameBtn);

            options.appendChild(document.createElement('br'));

            var importGameBtn = document.createElement('div');
            importGameBtn.classList.add('btn');
            importGameBtn.setAttribute('id', 'importG');
            importGameBtn.appendChild(document.createTextNode('Import Game'));
            options.appendChild(importGameBtn);

            var exportGameBtn = document.createElement('div');
            exportGameBtn.classList.add('btn');
            exportGameBtn.setAttribute('id', 'exportG');
            exportGameBtn.appendChild(document.createTextNode('Export Game'));
            options.appendChild(exportGameBtn);

            options.appendChild(document.createElement('br'));

            var optionsBtn = document.createElement('div');
            optionsBtn.classList.add('btn');
            optionsBtn.setAttribute('id', 'optionsBtn');
            optionsBtn.appendChild(document.createTextNode('Options'));
            options.appendChild(optionsBtn);

            var buildingsBtn = document.createElement('div');
            buildingsBtn.classList.add('btn');
            buildingsBtn.setAttribute('id', 'buildingsBtn');
            buildingsBtn.appendChild(document.createTextNode('Buildings'));
            options.appendChild(buildingsBtn);

            var upgradesBtn = document.createElement('div');
            upgradesBtn.classList.add('btn');
            upgradesBtn.setAttribute('id', 'upgradesBtn');
            upgradesBtn.appendChild(document.createTextNode('Upgrades'));
            options.appendChild(upgradesBtn);

            // colRight
            colRight.setAttribute('id','col3');

            var upgradeListContainer = document.createElement('div');
            upgradeListContainer.setAttribute('id', 'upgradeListContainer');
            colRight.appendChild(upgradeListContainer);

            var upgradeListTitle = document.createElement('h1');
            upgradeListTitle.setAttribute('id', 'upgradeListTitle');
            upgradeListTitle.appendChild(document.createTextNode('Upgrades'));
            upgradeListContainer.appendChild(upgradeListTitle);

            var upgradeStore = document.createElement('div');
            upgradeStore.setAttribute('id', 'upgrade');
            upgradeListContainer.appendChild(upgradeStore);
            // drawed in Upgrade.draw

            // container
            var backToMain = document.createElement('div');
            backToMain.setAttribute('id', 'backToMain');
            backToMain.appendChild(document.createTextNode('Back To Main'));
            container.appendChild(backToMain);
            
            container.appendChild(colLeft);
            container.appendChild(colMid);
            container.appendChild(colRight);
            
            // achievements
            var achievementHolder = document.createElement('div');
            achievementHolder.setAttribute('id', 'achievement');
            achievementHolder.style.display = 'none';
            
            var achievementImg = document.createElement('div');
            achievementImg.setAttribute('id', 'achievementImg');
            achievementHolder.appendChild(achievementImg);
            
            var achievementInfo = document.createElement('div');
            achievementInfo.setAttribute('id', 'achievementInfo');
            achievementHolder.appendChild(achievementInfo);
            
            var achievementNote = document.createElement('div');
            achievementNote.setAttribute('id', 'achievementNote');
            achievementNote.appendChild(document.createTextNode("Achievement Earned!"));
            achievementInfo.appendChild(achievementNote);
            
            var achievementName = document.createElement('div');
            achievementName.setAttribute('id', 'achievementName');
            achievementInfo.appendChild(achievementName);
            
            container.appendChild(achievementHolder);
            
            Game.drawed = true;
        };
        
        Game.sortUpgrades = function () {
            var self = Game,
                sortedUpgrades = self.upgradeStore,
                upgrades = sortedUpgrades.childNodes,
                upgradesArr = [],
                i;
            for (i in upgrades) {
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
        };
        
        Game.refreshCount = function () {
            if (Game.prefs.shortNums === 0) {
                Game.count.textContent = Tools.beautify(Math.floor(Game.volts)) + " volt" + (Math.floor(Game.volts) > 1 ? "s" : "");
                Game.vpsDisplay.textContent = Tools.beautify(Game._vps.toFixed(2)) + " volt" + (Game._vps > 1 ? "s" : "") + "/second";
            } else {
                Game.count.textContent = Tools.metricSuffix(Math.floor(Game.volts));
                Game.vpsDisplay.textContent = Tools.metricSuffix(Game._vps.toFixed(2)) + "/second";
            }
        };
        
        Game.refreshTitle = function () {
            var count, name = "Lightbulb Inc";
            count = Game.prefs.shortNums ? Tools.metricSuffix(Game.volts) : Tools.beautify(Math.floor(Game.volts)) + " volt" + (Math.floor(Game.volts) > 1 ? "s" : "");
            document.title = count + " - " + name;
        };
        
        Game.openOptions = function () {
            var self = Game;
            
            var optionsHolder = document.createElement('div');
            optionsHolder.classList.add('options');
            
            var optionsTitle = document.createElement('h1');
            optionsTitle.appendChild(document.createTextNode("Options"));
            optionsHolder.appendChild(optionsTitle);
            
            var shortNumsBtn = document.createElement('span');
            shortNumsBtn.classList.add('btn');
            shortNumsBtn.setAttribute('id', 'shortNumsBtn');
            shortNumsBtn.appendChild(document.createTextNode("Enable Short Numbers"));
            optionsHolder.appendChild(shortNumsBtn);
            
            var pausedBtn = document.createElement('span');
            pausedBtn.classList.add('btn');
            pausedBtn.setAttribute('id', 'pausedBtn');
            pausedBtn.appendChild(document.createTextNode("Pause Game"));
            optionsHolder.appendChild(pausedBtn);
            
            var autoSaveBtn = document.createElement('span');
            autoSaveBtn.classList.add('btn');
            autoSaveBtn.setAttribute('id', 'autoSaveBtn');
            autoSaveBtn.appendChild(document.createTextNode("Enable Autosave"));
            optionsHolder.appendChild(autoSaveBtn);
            
            // statistics
            
            var statisticsTitle = document.createElement('h1');
            statisticsTitle.appendChild(document.createTextNode("Statistics"));
            optionsHolder.appendChild(statisticsTitle);
            
            optionsHolder.appendChild(document.createTextNode('Version ' + Game.versionRead));
            
            optionsHolder.appendChild(document.createElement('br'));
            
            optionsHolder.appendChild(document.createTextNode(
                "Volts in bank: " + Tools.beautify(Math.floor(Game.volts))
            ));
            
            optionsHolder.appendChild(document.createElement('br'));
            
            optionsHolder.appendChild(document.createTextNode(
                "Total volts (Game session): " + Tools.beautify(Math.floor(Game.voltsTot))
            ));
            
            optionsHolder.appendChild(document.createElement('br'));
            
            optionsHolder.appendChild(document.createTextNode(
                "Total volts (all time): " + Tools.beautify(Math.floor(Game.voltsTotAll))
            ));
            
            optionsHolder.appendChild(document.createElement('br'));
            
            optionsHolder.appendChild(document.createTextNode("Session Started: " + Game.sessionStart));
            
            optionsHolder.appendChild(document.createElement('br'));
            
            optionsHolder.appendChild(document.createTextNode("Game Started: " + Game.gameStart));
            
            optionsHolder.appendChild(document.createElement('br'));
            
            optionsHolder.appendChild(document.createTextNode("Bulbs created: " + Game.calc.buildingsCreated()));
            
            optionsHolder.appendChild(document.createElement('br'));
            
            optionsHolder.appendChild(document.createTextNode(
                "Clicked " + Tools.beautify(Game.clicked) + " times"
            ));
            
            optionsHolder.appendChild(document.createElement('br'));
            
            optionsHolder.appendChild(document.createTextNode(
                Tools.beautify(Game._vps.toFixed(2) + "  bulbs gained per second")
            ));
            
            optionsHolder.appendChild(document.createElement('hr'));
            
            var upgradesTitle = document.createElement('h1');
            upgradesTitle.appendChild(document.createTextNode("Upgrades"));
            optionsHolder.appendChild(upgradesTitle);
            
            var upgradesHolder = document.createElement('div');
            upgradesHolder.setAttribute('id', 'upgradesHolder');
            optionsHolder.appendChild(upgradesHolder);
            
            var u, a;
            
            for (u in Game.upgrades) {
                if (!Game.upgrades[u].amount) continue;
                upgradesHolder.appendChild(Game.upgrades[u].draw(1));
            }
            
            var achievementTitle = document.createElement('h1');
            achievementTitle.appendChild(document.createTextNode("Achievements"));
            optionsHolder.appendChild(achievementTitle);
            
            var achievementHolder = document.createElement('div');
            optionsHolder.appendChild(achievementHolder);
            
            for (a in Game.achievements) {
                if (!Game.achievements[a].amount) continue;
                achievementHolder.appendChild(Game.achievements[a].drawBox());
            }
            
            // events
            Modal.open({
                content: optionsHolder,
                closeCallback: function () {
                    self.optionsOpened = false;
                }
            });
            
            Game.shortNumsBtn = l('#shortNumsBtn');
            Game.pausedBtn = l('#pausedBtn');
            Game.autoSaveBtn = l('#autoSaveBtn');
            
            Game.shortNumsBtn.addEventListener("click", function () {
                self.togglePrefs("shortNums");
            });
            
            Game.pausedBtn.addEventListener("click", function () {
                self.togglePrefs("paused");
            });
            
            Game.autoSaveBtn.addEventListener("click", function () {
                self.togglePrefs("autoSave");
            });
            
            Game.optionsOpened = true;
        };
        
        Game.updateOptions = function () {
            if (!Game.optionsOpened) return;
            Game.shortNumsBtn.textContent = Game.prefs.shortNums ? "Disable Short Numbers" : "Enable Short Numbers";
            Game.pausedBtn.textContent = Game.prefs.paused ? "Resume Game" : "Pause Game";
            Game.autoSaveBtn.textContent = Game.prefs.autoSave ? "Disable Autosave" : "Enable Autosave";
        };
        
        Game.openFactoryName = function () {
            var self = Game;
            var factoryNameHolder = document.createElement('div');
            factoryNameHolder.setAttribute('id', 'factoryNameHolder');
            factoryNameHolder.classList.add('inputHolder');
            
            var factoryNameTitle = document.createElement('h1');
            factoryNameTitle.appendChild(document.createTextNode('Factory Name'));
            factoryNameHolder.appendChild(factoryNameTitle);
            
            var factoryNameInput = document.createElement('input');
            factoryNameInput.setAttribute('type', 'text');
            factoryNameInput.setAttribute('value', Game.factName);
            factoryNameInput.setAttribute('placeholder', 'Input Name Here...');
            factoryNameInput.setAttribute('id', 'factoryNameInput');
            factoryNameHolder.appendChild(factoryNameInput);
            
            var btnHolder = document.createElement('div');
            btnHolder.classList.add('btnHolder');
            factoryNameHolder.appendChild(btnHolder);
            
            var setNameBtn = document.createElement('div');
            setNameBtn.classList.add('btn', 'inline', 'right');
            setNameBtn.appendChild(document.createTextNode("OK"));
            btnHolder.appendChild(setNameBtn);
            
            // events
            Game.factNameInput = factoryNameInput;
            Game.factNameBtn = setNameBtn;
            Game.factNameBtn.addEventListener("click", function () {
                if (self.factNameInput.value) self.updateFactName(self.factNameInput.value);
                Modal.close();
            });
            
            Modal.open({
                content: factoryNameHolder
            });
        };
        
        // time travel
        Game.drawTimeTravel = function () {
            var options = l(".options.menu");
            
            var timeTravelBtn = document.createElement("div");
            timeTravelBtn.classList.add("btn", "red-btn");
            timeTravelBtn.setAttribute("id", "timeTravelBtn");
            timeTravelBtn.appendChild(document.createTextNode("Time Travel"));
            
            options.appendChild(document.createElement("br"));
            options.appendChild(timeTravelBtn);
            
            Tools.animateCSS(timeTravelBtn, 'fadeIn');
            
            Game.timeTravelBtn = timeTravelBtn;
        };
        
        Game.timeTravelDialog = function () {
            var timeTravelHolder = document.createElement("div");
            
            Modal.open({
                content: timeTravelHolder
            });
        };
        
        // mobile helper
        Game.switchColumn = function (col) {
            switch (col) {
                case 1:
                    Game.col1.style.display = "block";
                    Game.col2.style.display = "none";
                    Game.col3.style.display = "none";
                    Game.backToMain.style.display = "block";
                break;
                case 2:
                    Game.col1.style.display = "none";
                    Game.col2.style.display = "block";
                    Game.col3.style.display = "none";
                    Game.backToMain.style.display = "none";
                break;
                case 3:
                    Game.col1.style.display = "none";
                    Game.col2.style.display = "none";
                    Game.col3.style.display = "block";
                    Game.backToMain.style.display = "block";
                break;
            }
        };
        
        // events
        Game.bulbClick = function () {
            Game._earn(1);
            Game.Level.gainExp(1);
            Game.clicked++;
        };
        
        Game.statsClick = function () {
            
        };
        
        Game.saveGClick = function () {
            Game.saveGame();
        };
        
        Game.togglePrefs = function (pref) {
            if (Game.prefs[pref]) Game.prefs[pref] = 0;
            else Game.prefs[pref] = 1;
        };
        
        Game.resetGClick = function () {
            Game.reset();
        };
        
        Game.hresetGClick = function () {
            var container = document.createElement("div");
            container.appendChild(document.createTextNode("Do you really want to hard reset the game?"));
            
            var btnHolder = document.createElement('div');
            btnHolder.classList.add('btnHolder');
            container.appendChild(btnHolder);
            
            var resetBtn = document.createElement('div');
            resetBtn.classList.add('btn', 'inline', 'right');
            resetBtn.appendChild(document.createTextNode("Yes"));
            resetBtn.addEventListener("click", function () {
                Game.reset(1);
                Modal.close();
            });
            
            btnHolder.appendChild(resetBtn);
            
            Modal.open({
                content: container
            });
        };
        
        Game.saveGame = function () {
            if (window.localStorage) {
                var savefile = Game.saveload.saveGame();
                window.localStorage.setItem(Game.lStorageName, savefile);
            }
        };
        
        Game.loadGame = function () {
            if (window.localStorage && window.localStorage[Game.lStorageName]) {
                var load = Game.saveload.loadGame(localStorage.getItem(Game.lStorageName));
                if (Array.isArray(load) && load.length > 0) {
                    Modal.open({
                        content: load.join("\n")
                    });
                }
            }
        };
        
        Game.reset = function (hard) {
            var b, u;
            
            Game.volts = 0;
            Game.voltsTot = 0;
            
            for (b in Game.buildings) {
                Game.buildings[b].amount = 0;
                Game.buildings[b].displayed = false;
                Game.buildings[b].cost = Game.buildings[b].baseCost;
            }
            
            Game.sessionStart = new Date();
            Game.Level.level = 0;
            Game.Level.exp = 0;
            Game.Level.toNextLevel = 0;
            Game.Level.levelTotalExp = 0;
            Game.Level.levelCap = 100;
            Game._vps = 0;
            Game._vpc = 0;
            
            for (u in Game.upgrades) {
                Game.upgrades[u].amount = 0;
                Game.upgrades[u].displayed = false;
            }
            
            // hard-specific
            if (hard) {
                Game.factName = "";
                Game.gameStart = new Date();
                Game.prestiege = 0;
                Game.voltsTotAll = 0;
                Game.clicked = 0;
                localStorage.removeItem(Game.lStorageName);
            }
            
            // soft
            if (!hard) {
                if (Game.upgrades['prestiegemode'].amount === 1) Game.prestiege += Game.calc.calcPrestiege();
            }
            
            Game.refresh();
        };
        
        Game._earn = function (i) {
            Game.volts += i;
            Game.voltsTot += i;
            Game.voltsTotAll += i;
        };
        
        Game._remove = function (i) {
            Game.volts -= i;
        };
        
        Game._calcVPS = function () {
            var vps = Game.calc.calcVPS();
            Game._vps = vps;
            return vps;
        };
        
        Game._calcVPC = function () {
            var vpc = Game.calc.calcVPC();
            Game._vpc = vpc;
            return vpc;
        };
        
        Game.updateFactName = function (str) {
            Game.factName = str;
            Game.factNameDisplay.textContent = str || "Your Factory";
            
            if (str.toLowerCase() === "illuminati") {
                Game.earnAchievement("triangle");
            }
        };
        
        Game.earnAchievement = function (id) {
            if (Game.achievements[id] === undefined) return;
            if (!Game.achievements[id].earn()) return;
            Game.statusAchievement(id);
        };
        
        Game.statusAchievement = function (id) {
            if (Game.achievements[id] === undefined) return;
            
            var self = Game,
            achievement = Game.achievements[id];
            
            Game.achievementImg.style.backgroundImage = ('url: ("' + achievement.name + '")');
            Game.achievementName.textContent = achievement.name;
            
            Game.achievementHolder.style.display = "";
            Tools.animateCSS(Game.achievementHolder, "fadeIn");
            setTimeout(function () {
                Tools.animateCSS(self.achievementHolder, "fadeOut", function (el) {
                    el.style.display = "none";
                });
            }, 2000);
        };
        
        Game.refresh = function () { // screen tick
            var self = Game, _building, _upgrade;
            
            window.requestAnimationFrame(function () {
                self.refresh();
            });
            
            // options
            // (has to go first to control "Resume/Pause Game" option)
            Game.updateOptions();
            
            if (Game.prefs.paused) return;
            
            Game.refreshCount();
            
            // buildings
            for (_building in Game.buildings) {
                Game.buildings[_building].refresh();
            }
            
            // upgrades
            for (_upgrade in Game.upgrades) {
                Game.upgrades[_upgrade].refresh();
            }
            
            // level
            Game.Level.update();
        };
        
        Game.logic = function () { // logic tick
            if (Game._vps) Game._earn(Game._vps);
            
            if (Game.volts > 0) Game.earnAchievement("firsttimer");
            if (Game.volts > 100) Game.earnAchievement("100");
            if (Game.volts > 1000) Game.earnAchievement("1000");
            if (Game.volts > 1000000) Game.earnAchievement("1000000");
            if (Game.volts > 10000000) Game.earnAchievement("10000000");
            
            if (Game.upgrades)
            
            if (Game.factName === "Illuminati") Game.earnAchievement("triangle");
        };
        
        Game.loop = function () {
            if (Game.prefs.paused) return;
            
            Game.elapsed = ((Date.now() - Game.lastTick) / 1000);
            
            ++Game.logicElasped;
            ++Game.autoSaveElapsed;
            ++Game.weatherElapsed;
            
            if (Game.logicElasped >= 1) {
                Game.logic();
                Game.logicElasped = 0;
            }
            
            if (Game.weatherElapsed >= 86400) {
                Game.WeatherHandler.logic();
                Game.weatherElapsed = 0;
            }
            
            Game.refreshTitle();
            
            if (Game.prefs.autoSave && Game.autoSaveElapsed >= 120) {
                Game.saveGame();
                Game.autoSaveElapsed = 0;
            }
            
            Game.lastTick = Date.now();
            
            setTimeout(Game.loop, 1000);
        };
        
        return Game;
    }());
    // dom load
    window.addEventListener('DOMContentLoaded', function(){
        window.Game.init();
    });
})(window);