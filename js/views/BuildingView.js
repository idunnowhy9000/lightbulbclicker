define(['underscore', 'backbone', 'utils',
	'models/BuildingModel', 'models/AppModel',
	'text!templates/buildings.html', 'text!templates/buildings-tooltip.html',
	'tooltip'],
	function (_, Backbone, utils,
		BuildingModel, AppModel,
		buildingsTemplate, tooltipTemplate) {
	
	var BuildingView = Backbone.View.extend({
		model: BuildingModel,
		template: _.template(buildingsTemplate),
		tooltipTemplate: _.template(tooltipTemplate),
		
		className: 'buildingHolder',
		
		events: {
			'click .buildingObj': 'buy',
			'click .buy10': 'buy10',
			'click .buyMax': 'buyMax',
			'click .sell10': 'sell10',
			'click .sellMax': 'sellMax',
		},
		
		initialize: function () {
			this.listenTo(this.model, 'change', this.refresh);
			this.listenTo(AppModel, 'volts', this.refresh);
			
			this.render()
				.refresh();
		},
		
		render: function () {
			var self = this;
			this.$el.html(this.template(this.model.attributes))
				.popover({
					trigger: 'hover',
					html: true,
					container:'body',
					content: function () {
						return self.tooltipTemplate(self.model.attributes);
					},
					placement: 'right',
					title: this.model.get('name'),
				});
			return this;
		},
		
		refresh: function () {
			this.$el.html(this.template(this.model.attributes));
			if (this.model.getCurrentCost() > AppModel.get('volts')) {
				this.$('.buildingObj').addClass('disabled');
			} else {
				this.$('.buildingObj').removeClass('disabled');
			}
			if (!this.model.get('displayed')) this.$el.hide();
			if (AppModel.get('volts') >= this.model.get('displayAt') && !this.model.get('displayed')) {
				this.model.set('displayed', true);
				this.$el.fadeIn(400).show();
			}
			
			return this;
		},
		
		// Buy sell functions
		buy: function () {
			this.model.buy(1);
		},
		
		buy10: function () {
			this.model.buy(10);
		},
		
		buyMax: function () {
			this.model.buy(Infinity);
		},
		
		sell: function () {
			this.model.sell(1);
		},
		
		sell10: function () {
			this.model.sell(10);
		},
		
		sellMax: function () {
			this.model.sell(Infinity);
		},
		
	});
	
	return BuildingView;
	
});