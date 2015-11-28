define(['jquery', 'underscore', 'backbone',
	'text!templates/app.html'],
	function ($, _, Backbone,
		appTemplate) {
	var AppView = Backbone.View.extend({
		
		el: '#container',
		
		template: _.template(appTemplate),
		
		events: {
			'click #bulb': 'bulbClick',
		},
		
		initialize: function () {
			this.render();
		},
		
		render: function () {
			this.$el.html(this.template());
			return this;
		},
		
		// Events
		
		
	});
	
	return AppView;
	
});