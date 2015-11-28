requirejs.config({
	baseUrl: 'js/',
	paths: {
		jquery: "lib/jquery",
		bootstrap: "lib/bootstrap",
		backbone: "lib/backbone",
		underscore: "lib/underscore",
		text: "lib/text"
	},
	shim: {
		'jquery': { exports: '$' },
		'underscore': { exports: '_' },
		'backbone': {
			deps: ['jquery', 'underscore'],
			exports: 'Backbone'
		},
		'bootstrap': {
			deps: ['jquery']
		}
	}
});

require(['backbone', 'views/app', 'routers/Router','bootstrap'],
	function (Backbone, AppView, Router) {

	new Router();
	Backbone.history.start();
	
	new AppView();
	
});