(function (Game) {
    "use strict";
    Game.StarSystem = function () {
        this.stars = [];
        this.planets = [];
        this.update = function () {}
        this.draw = function () {}
        return this;
    }
})(window.Game || {});