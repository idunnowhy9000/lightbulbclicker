/*************************************************
* Lightbulb Clicker's weather handler script file
* Controls the weather
*************************************************/
(function (window) {
	"use strict";
	// todo: work on this
	window.Game.WeatherHandler = {
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
		// functions
		geoLocation: function () {
			var self = this,
				geoLocateHandler = {}, returnState;
			returnState = -2;
			geoLocateHandler.success = function (pos) {
				returnState = 0;
			}
			geoLocateHandler.error = function () {
				returnState = -1;
			}
			geoLocateHandler.options = {
				enableHighAccuracy: false,
				timeout: 5000,
				maximumAge: 0
			};
			window.navigator.geolocation.getCurrentPosition(geoLocateHandler.success, geoLocateHandler.error, geoLocateHandler.options);
			return returnState;
		},
		getWeatherLocation: function (pos) {
			var self = this,
				lat = pos.coords.latitude,
				lon = pos.coords.longitude,
				appId = "",
				url = "api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "",
				httpRequest, response,
				guessCondition;
			httpRequest = ajax(url, function (data) {
				var weatherData = JSON.parse(data),
					loc = weatherData[0],
					condition = loc.main.weather[0].main;
				switch (condition) {
					case "Thunderstorm":
					case "Drizzle":
					case "Rain":
						guessCondition = self.WEATHER_RAINY;
						break;
					case "Snow":
						guessCondition = self.WEATHER_SNOWY;
						break;
					case "Atmosphere":
					case "Clouds":
						guessCondition = self.WEATHER_CLOUDY;
					default:
						guessCondition = self.WEATHER_SUNNY;
						break;
				}
			});
			return guessCondition;
		},
		getWeatherPredict: function () {
			var date = window.Game.curDate,
				day = undefined,
				baseWeather = undefined,
				nearestWeather = undefined,
				weather = undefined;
			if (date instanceof Date && !isNaN(date.valueOf())) {
				day = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
				if (day >= 0 && day <= 90) baseWeather = this.WEATHER_CLOUDY;
				else if (day >= 91 && day <= 181) baseWeather = this.WEATHER_SUNNY;
				else if (day >= 181 && day <= 271) baseWeather = this.WEATHER_RAINY;
				else if (day >= 271 && day <= 365) baseWeather = this.WEATHER_SNOWY;
				else baseWeather = this.WEATHER_SNOWY;
			}
			if (baseWeather) {
				if (baseWeather === this.WEATHER_CLOUDY) nearestWeather = this.WEATHER_RAINY;
				else if (baseWeather === this.WEATHER_RAINY) nearestWeather = this.WEATHER_CLOUDY;
				else if (baseWeather === this.WEATHER_SUNNY) nearestWeather = this.WEATHER_CLOUDY;
				else nearestWeather = this.WEATHER_SNOWY;
			}
			weather = Tools.choose([baseWeather, nearestWeather]);
			return weather;
		},
		setWeather: function (weather) {
			
		},
		update: function () {
			
		},
		draw: function () {
		
		},
		refresh: function () {
		
		},
		init: function () {
			if (window.navigator.geoLocation) {
				if (this.geoLocation() < 0) this.baseWeather = this.getWeatherPredict();
			} else {
				this.baseWeather = this.getWeatherPredict();
			}
			this.update();
			this.draw();
			this.refresh();
		},
	}
})(window);