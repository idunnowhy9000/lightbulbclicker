requirejs.config({
	baseUrl: 'js/',
	paths: {
		jquery: "lib/jquery",
		bootstrap: "lib/bootstrap",
		tooltip: "lib/tooltip",
		backbone: "lib/backbone",
		localStorage: "lib/backbone.localStorage",
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
		'localStorage': {
			deps: ['backbone']
		},
		'bootstrap': {
			deps: ['jquery']
		},
		'tooltip': {
			deps: ['jquery', 'bootstrap']
		}
	}
});

require(['backbone', 'jquery', 'views/AppView', 'routers/Router', 'bootstrap'],
	function (Backbone, $, AppView, Router) {
	
	$(function () {
		new Router();
		Backbone.history.start();
		
		new AppView();
	});
	
});