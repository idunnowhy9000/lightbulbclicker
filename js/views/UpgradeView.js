define(['underscore', 'backbone', 'utils',
	'models/UpgradeModel', 'models/AppModel',
	'text!templates/upgrades.html', 'text!templates/upgrades-tooltip.html',
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
			this.listenTo(this.model, 'change', this.render);
			this.listenTo(AppModel.buildingCollection, 'change:amount', this.render);
			this.listenTo(AppModel.Level, 'change:level', this.render);
			
			this.render();
		},
		
		render: function () {
			this.$el.html(this.template(this.model.attributes))
				.popover({
					trigger: 'hover',
					html: true,
					container:'body',
					content: this.tooltipTemplate(this.model.attributes),
					placement: 'bottom',
					title: this.model.get('name'),
				});
			
			if (!this.model.get('displayed')) this.$el.hide();
			
			if (this.model.canDisplay()) {
				this.model.set('displayed', true);
				this.$el.fadeIn(400).show();
			}
			
			if (this.model.get('cost') > AppModel.get('volts')) {
				this.$('.buildingObj').addClass('disabled');
			} else {
				this.$('.buildingObj').removeClass('disabled', 200);
			}
			
			if (this.model.get('earned')) {
				this.$el.hide()
					.popover('hide');
			}
			
			return this;
		},
		
		buy: function () {
			this.model.buy();
		}
		
	});
	
	return UpgradeView;
	
});