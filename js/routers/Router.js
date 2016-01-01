define(['underscore', 'backbone'], function (_, Backbone) {
	
	var Router = Backbone.Router.extend({
		
		initialize: function (options) {
			this.view = options.appView;
		},
		
		routeTmpl: function (route, name, template) {
			var self = this;
			if (!template) template = 'text!templates/' + name + '.html';
			this.route(route, name, function () {
				require([template], function (template) {
					self.view.switchColumn(name, _.template(template));
				});
			});
		}
		
	});
	
	var initialize = function (options) {
		var route = new Router(options);
		route.routeTmpl('', 'main');
		route.routeTmpl('options', 'options');
		route.routeTmpl('stats', 'stats');
		
		Backbone.history.start();
	}
	
	return {
		initialize: initialize
	};
	
});