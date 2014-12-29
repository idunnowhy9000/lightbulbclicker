(function (window) {
	"use strict";
	// todo: work on this
	window.Game.WeatherHandler = {
		// vars
		WEATHER_SUNNY: ".... --- -",
		WEATHER_CLOUDY: "-.-. .-.. . .- .-.",
		WEATHER_RAINY: ".- --.- ..- .-",
		WEATHER_SNOWY: ". .-.. ... .-",
		// functions
		geoLocation: function () {
			var self = this,
				geoLocateHandler = {};
			geoLocateHandler.success = function (pos) {
				self.setWeather(self.getWeatherLocation(pos));
			}
			geoLocateHandler.error = function () {
				self.setWeather(self.getWeatherPredict());
			}
			geoLocateHandler.options = {
				enableHighAccuracy: false,
				timeout: 5000,
				maximumAge: 0
			};
			window.navigator.geolocation.getCurrentPosition(geoLocateHandler.success, geoLocateHandler.error, geoLocateHandler.options);
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
					firstLoc = weatherData[0],
					mainWeather = firstLoc.main.weather[0],
					condition = mainWeather.main;
				if (condition === 'Thunderstorm' || condition === 'Drizzle' || condition === 'Rain') guessCondition = self.WEATHER_RAINY;
				else if (condition === 'Snow') guessCondition = self.WEATHER_SNOWY;
				else if (condition === 'Atmosphere' || condition === 'Clouds') guessCondition = self.WEATHER_CLOUDY;
				else guessCondition = self.WEATHER_SUNNY;
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
				else if (day >= 271 && day <= 366) baseWeather = this.WEATHER_SNOWY;
				else baseWeather = this.WEATHER_SNOWY
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
		setWeather: function () {
			
		},
		init: function () {
		
		}
	}
})(window);