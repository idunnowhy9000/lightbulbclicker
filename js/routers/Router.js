define(['underscore', 'backbone',
	'text!templates/main.html','text!templates/options.html','text!templates/stats.html'],
	function (_, Backbone,
		mainTmpl, optionsTmpl, statsTmpl) {
	
	var Router = Backbone.Router.extend({
		
		routes: {
			'': 'main',
			'options': 'options',
			'stats': 'stats'
		},
		
		initialize: function (options) {
			this.view = options.appView;
		},
		
		// Routes
		main: function () {
			this.view.switchColumn('main', mainTmpl);
		},
		
		options: function () {
			this.view.switchColumn('options', optionsTmpl);
		},
		
		stats: function () {
			this.view.switchColumn('stats', statsTmpl);
		}
		
	});
	
	var initialize = function (options) {
		var route = new Router(options);
		Backbone.history.start();
	}
	
	return {
		initialize: initialize
	};
	
});