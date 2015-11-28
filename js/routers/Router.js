define(['backbone'], function (Backbone) {
	
	var Router = Backbone.Router.extend({
		
		routes: {
			'#help': 'help'
		},
		
		help: function () {
			
		}
		
	});
	
	return Router;
	
});