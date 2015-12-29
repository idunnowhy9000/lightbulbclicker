requirejs.config({
	baseUrl: 'js/',
	paths: {
		jquery: 'lib/jquery',
		bootstrap: 'lib/bootstrap.min',
		tooltip: 'lib/tooltip',
		backbone: 'lib/backbone',
		underscore: 'lib/underscore',
		bootbox: 'lib/bootbox.min',
		text: 'lib/text'
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
		'bootbox': {
			deps: ['jquery', 'bootstrap']
		},
		'tooltip': {
			deps: ['jquery', 'bootstrap']
		}
	}
});

require(['backbone', 'jquery',
	'views/AppView', 'routers/Router', 'bootstrap'],
	function (Backbone, $, AppView, Router) {
	
	Router.initialize({ appView: new AppView() });
});