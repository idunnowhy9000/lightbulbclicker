define(["underscore", "backbone", "utils",
	"models/BuildingModel", "models/AppModel",
	"text!templates/buildings.html", "text!templates/buildings-tooltip.html",
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
			'click': 'buy'
		},
		
		initialize: function () {
			this.listenTo(this.model, "change", this.render);
			this.listenTo(AppModel, "volts", this.render);
		},
		
		render: function () {
			this.$el.html(this.template(this.model.attributes))
				.popover({
					trigger: 'hover',
					html: true,
					container:'body',
					content: this.tooltipTemplate(this.model.attributes),
					placement: "right",
					title: this.model.get('name'),
				});
			
			if (this.model.get('cost') > AppModel.get('volts')) {
				this.$('.buildingObj').addClass('disabled');
			} else {
				this.$('.buildingObj').removeClass('disabled', 200);
			}
			if (!this.model.get('displayed')) this.$el.hide();
			if (AppModel.get('volts') >= this.model.get('displayAt') && !this.model.get('displayed')) {
				this.model.set('displayed', true);
				this.$el.fadeIn(400).show();
			}
			
			return this;
		},
		
		buy: function () {
			this.model.buy();
		}
		
	});
	
	return BuildingView;
	
});