require.config({
	baseUrl: 'js/',
	paths: {
		jquery: 'lib/jquery',
		bootstrap: 'lib/bootstrap.min',
		tooltip: 'lib/tooltip',
		backbone: 'lib/backbone',
		underscore: 'lib/underscore',
		bootbox: 'lib/bootbox.min',
		text: 'lib/text',
		requirejs: 'lib/require'
	},
	shim: {
		jquery: { exports: '$' },
		underscore: { exports: '_' },
		backbone: {
			deps: ['jquery', 'underscore'],
			exports: 'Backbone'
		},
		localStorage: {
			deps: ['backbone']
		},
		bootstrap: {
			deps: ['jquery']
		},
		bootbox: {
			deps: ['jquery', 'bootstrap']
		},
		tooltip: {
			deps: ['jquery', 'bootstrap']
		}
	},
	include: ['requirejs']
});

require(['backbone', 'jquery', 'bootbox',
	'views/AppView', 'routers/Router',
	'bootstrap'],
	function (Backbone, $, bootbox, AppView, Router) {
	
	bootbox.setDefaults({
		backdrop: true
	});
	
	Router.initialize({ appView: new AppView() });
});