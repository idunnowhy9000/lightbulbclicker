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
		
		initialize: function (options) {
			this.listenTo(this.model, 'change:earned', this.refresh);
			this.listenTo(AppModel, 'volts', this.refresh);
			this.listenTo(AppModel.buildingCollection, 'change:amount', this.refresh);
			this.listenTo(AppModel.Level, 'change:level', this.refresh);
				
			this.render()
				.refresh();
		},
		
		render: function () {
			var self = this;
			this.$el.html(this.template(_.extend(this.model.attributes, utils)))
				.popover({
					trigger: 'hover',
					html: true,
					container:'body',
					content: function () {
						return self.tooltipTemplate(self.model.attributes);
					},
					placement: 'bottom',
					title: this.model.get('name'),
				});
			
			return this;
		},
		
		refresh: function () {
			if (this.model.get('earned')) {
				this.$el.hide().popover('hide');
				return this;
			}
			
			this.$el.html(this.template(this.model.attributes));
			if (this.model.get('cost') > AppModel.get('volts')) {
				this.$('.upgradeObj').addClass('disabled');
			} else {
				this.$('.upgradeObj').removeClass('disabled');
			}
			
			if (!this.model.get('displayed')) this.$el.hide();
			if (this.model.canDisplay() && !this.model.get('displayed')) {
				this.model.set('displayed', true);
				this.$el.fadeIn(400).show();
			}
			
			return this;
		},
		
		buy: function () {
			this.model.buy();
			this.refresh();
		}
		
	});
	
	return UpgradeView;
	
});