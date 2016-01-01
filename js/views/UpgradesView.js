define(['backbone',
	'views/UpgradeView'],
	function (Backbone, UpgradeView) {
	
	var UpgradesView = Backbone.View.extend({
		
		tagName: 'div',
		id: 'upgrade',
		
		initialize: function () {
			this.views = [];
		},
		
		render: function (earnedOnly) {
			var self = this;
			this.$el.empty();
			this.collection.each(function (building) {
				var upgradeView = new UpgradeView({ model: building });
				self.views.push(upgradeView);
				self.$el.append(upgradeView.render().el);
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