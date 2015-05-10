/*************************************************
* Lightbulb Clicker's weather handler script file
* Controls the weather
*************************************************/
(function (Game) {
    "use strict";
    // todo: work on this
    Game.WeatherHandler = {
        // vars
        // constants
        WEATHER_SUNNY: 0,
        WEATHER_CLOUDY: 1,
        WEATHER_RAINY: 2,
        WEATHER_SNOWY: 3,
        
        // weather
        baseWeather: 0, // base for today
        curWeather: 0, // current
        lastWeather: 0, // last weather (1 hour)
        lastWeatherTick: 0, // 1 hour tick updates weather
        
        getWeatherPredict: function () {
            var date = Game.curDate,
                day = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
            
            if (day >= 0 && day <= 90) return this.WEATHER_CLOUDY;
            else if (day >= 91 && day <= 181) return this.WEATHER_SUNNY;
            else if (day >= 181 && day <= 271) return this.WEATHER_RAINY;
            else if (day >= 271 && day <= 365) return this.WEATHER_SNOWY;
            else return this.WEATHER_SNOWY;
        },
        
        logic: function () {
            this.baseWeather = this.getWeatherPredict();
        }
    };
    
})(window.Game || {});