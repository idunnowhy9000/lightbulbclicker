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
		
		events: {
			'click': 'buy'
		},
		
		initialize: function () {
			this.listenTo(this.model, "change", this.render);
		},
		
		render: function () {
			this.$el.html(this.template(this.model.attributes));
			
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
	
	return UpgradeView;
	
});