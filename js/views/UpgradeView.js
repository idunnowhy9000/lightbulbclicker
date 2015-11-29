define(["underscore", "backbone", "utils",
	"models/UpgradeModel", "models/AppModel",
	"text!templates/upgrades.html", "text!templates/upgrades-tooltip.html",
	'tooltip'],
	function (_, Backbone, utils,
		UpgradeModel, AppModel,
		upgradesTemplate, tooltipTemplate) {
	
	var UpgradeView = Backbone.View.extend({
		model: UpgradeModel,
		template: _.template(upgradesTemplate),
		tooltipTemplate: _.template(tooltipTemplate),
		
		className: 'upgradeHolder',
		
		events: {
			'click': 'buy'
		},
		
		initialize: function () {
			this.listenTo(this.model, "change", this.render);
		},
		
		render: function () {
			this.$el.html(this.template(this.model.attributes))
				.popover({
					trigger: 'hover',
					html: true,
					container:'body',
					content: this.tooltipTemplate(this.model.attributes),
					placement: "bottom",
					title: this.model.get('name'),
				});
			
			return this;
		},
		
		buy: function () {
			this.model.buy();
		}
		
	});
	
	return UpgradeView;
	
});