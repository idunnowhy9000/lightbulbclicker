requirejs.config({
	baseUrl: 'js/',
	paths: {
		// lib
		jquery: "lib/jquery",
		underscore: "lib/underscore",
	}
});

require(['models/Game'], function (Game) {
	var game = new Game();
	game.init();
});