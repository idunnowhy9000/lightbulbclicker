requirejs.config({
	baseUrl: 'js/',
	paths: {
		jquery: "lib/jquery",
		bootstrap: "lib/bootstrap",
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
		}
	}
});

require(['backbone', 'jquery', 'views/AppView', 'routers/Router','bootstrap'],
	function (Backbone, $, AppView, Router) {

	$(function () {
		new Router();
		Backbone.history.start();
		
		new AppView();
	});
	
});