(function (Game) {
    "use strict";
    Game.Achievement = function (options) {
        var Game = window.Game;
        if (!options.name) options.name = 'None';
        if (!options.id) options.id = Tools.toId(options.name);
        if (!options.description) options.description = '...';
        options.amount = 0;
        if (!options.onEarn || typeof options.onEarn !== 'function') options.onEarn = function (Game) {}
        options.earn = function () {
            if (this.amount === 1) return;
            this.amount = 1;
            this.onEarn(Game);
            return true;
        }
        options.drawBox = function () {
            var tempBtn = document.createElement('div');
            tempBtn.setAttribute('class', 'achievementObj');
            tempBtn.setAttribute('id', 'achievement-' + options.id);
            
            tempBtn.style.backgroundImage = ('url ("' + options.id + '")');
            
            var tooltipContent = document.createElement('div');
            
            var tooltipName = document.createElement('strong');
            tooltipName.textContent = this.name;
            tooltipContent.appendChild(tooltipName);
            
            tooltipContent.appendChild(document.createElement('br'));
            
            var tooltipDesc = document.createElement('span');
            tooltipDesc.textContent = this.description;
            tooltipContent.appendChild(tooltipDesc);
            
            var tooltip = new Tooltip({
                target: tempBtn,
                content: tooltipContent
            });
            
            return tempBtn;
        }
        return options;
    }
})(window.Game || {});