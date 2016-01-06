define(['backbone', 'underscore',
	'views/UpgradeView'],
	function (Backbone, _, UpgradeView) {
	
	var UpgradesView = Backbone.View.extend({
		
		tagName: 'div',
		id: 'upgrade',
		
		initialize: function (options) {
			this.views = [];
			if (options.stats) this.stats = options.stats;
		},
		
		render: function () {
			var self = this;
			
			this.$el.empty();
			
			if (this.stats) {
				var upgrades = this.collection.models;
			} else {
				var upgrades = this.collection.sortBy(function (upgrade) {
					return upgrade.get('cost');
				});
			}
			
			_.each(upgrades, function (upgrade) {
				var upgradeView = new UpgradeView({ model: upgrade });
				self.views.push(upgradeView);
				self.$el.append(upgradeView.el);
			});
			
			return this;
		},
		
		refresh: function () {
			_.each(this.views, function (view) {
				view.refresh();
			});
			return this;
		},
		
	});
	
	return UpgradesView;
	
});