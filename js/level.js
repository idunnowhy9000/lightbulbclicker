/*************************************************
* Lightbulb Clicker's level script file
* Controls drawing/accessing level
*************************************************/
(function (Game) {
    "use strict";
    Game.Level = {
        level: 1,
        exp: 0,
        toNextLevel: 100,
        neededToNext: 100,
        levelTotalExp: 0,
        levelCap: 100,
        levelN: "",
        
        levelUp: function () {
            this.level += 1;
            this.levelTotalExp += this.toNextLevel;
            this.toNextLevel = this.level * this.level * 100;
        },
        
        gainExp: function (exp) {
            var _results = [];
            this.exp += exp;
            if (this.level >= this.levelCap && this.exp > this.levelTotalExp) {
                this.exp = this.levelTotalExp;
            }
            while (this.exp >= this.levelTotalExp + this.toNextLevel && this.level < this.levelCap) {
                _results.push(this.levelUp());
            }
            this.neededToNext = this.toNextLevel - this.exp;
            return _results;
        },
        
        progressBar: undefined,
        progress: undefined,
        levelDisplay: undefined,
        lvlExpDisplay: undefined,
        lvlNDisplay: undefined,
        toNextLevelDisplay: undefined,
        
        update: function () {
            this.progress.style.width = ((this.exp / this.toNextLevel * 100) || 0) + "%";
            this.levelDisplay.textContent = "Level " + this.level;
            this.lvlExpDisplay.textContent = "(" + this.exp + " exp)";
            //this.lvlNDisplay.textContent = "<" + this.levelN + ">";
            this.toNextLevelDisplay.textContent = this.neededToNext + " exp to next level";
        },
        
        draw: function () {
            var tempProgressBar = document.createElement('div');
            tempProgressBar.setAttribute('id', 'levelbar');
            
            var tempProgress = document.createElement('div');
            tempProgress.setAttribute('id', 'progress');
            tempProgressBar.appendChild(tempProgress);
            
            this.progress = tempProgress;
            this.progressBar = tempProgressBar;
            Game.levelBarDisplay.appendChild(this.progressBar);
            
            var level = document.createElement('span');
            level.setAttribute('id', 'level');
            level.appendChild(document.createTextNode('Level 0'));
            Game.levelContainer.appendChild(level);
            
            var lvlExp = document.createElement('span');
            lvlExp.setAttribute('id', 'lvlExp');
            lvlExp.appendChild(document.createTextNode('(0 exp)'));
            Game.levelContainer.appendChild(lvlExp);
            
            var lvlN = document.createElement('span');
            lvlN.setAttribute('id', 'lvlN');
            lvlN.appendChild(document.createTextNode('<Bicycle>'));
            Game.levelContainer.appendChild(lvlN);
            
            var toNextLevel = document.createElement('p');
            toNextLevel.setAttribute('id', 'toNextLevel');
            toNextLevel.appendChild(document.createTextNode('0 exp to next level'));
            Game.levelContainer.appendChild(toNextLevel);
            
            this.levelDisplay = level;
            this.lvlExpDisplay = lvlExp;
            this.lvlNDisplay = lvlN;
            this.toNextLevelDisplay = toNextLevel;
        }
    };
})(window.Game || {});