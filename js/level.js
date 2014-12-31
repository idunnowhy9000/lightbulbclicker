/*************************************************
* Lightbulb Clicker's level script file
* Controls drawing/accessing level
*************************************************/
(function (window) {
	"use strict";
	window.Game.Level = function () {
		this.level = 1;
		this.exp = 0;
		this.toNextLevel = 100;
		this.neededToNext = 100;
		this.levelTotalExp = 0;
		this.levelCap = 100;
		this.levelN = "";
		this.levelUp = function () {
			this.level += 1;
			this.levelTotalExp += this.toNextLevel;
			this.toNextLevel = this.level * this.level * 100;
		}
		this.gainExp = function (exp) {
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
		}
		this.progressBar = undefined;
		this.progress = undefined;
		this.levelDisplay = undefined;
		this.lvlExpDisplay = undefined;
		this.lvlNDisplay = undefined;
		this.toNextLevelDisplay = undefined;
		this.update = function () {
			this.progress.style.width = ((this.exp / this.toNextLevel) * 100) + "%";
			this.levelDisplay.childNodes[0].nodeValue = "Level " + this.level;
			this.lvlExpDisplay.childNodes[0].nodeValue = "(" + this.exp + " exp)";
			//this.lvlNDisplay.childNodes[0].nodeValue = "<" + this.levelN + ">";
			this.toNextLevelDisplay.childNodes[0].nodeValue = this.neededToNext + " exp to next level";
		}
		this.draw = function () {
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
		return this;
	};
})(window);